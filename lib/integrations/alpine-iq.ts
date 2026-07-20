import { getServerEnv } from "@/lib/env/server-env";
import type { AudienceSegment } from "@/lib/types/campaign";

const sampleAudiences: AudienceSegment[] = [
  {
    id: "320400",
    name: "Edible Customers - Klaviyo Test 320400",
    source: "alpine-iq",
    memberCount: 2840,
    description: "Test audience ID supplied for Klaviyo draft creation."
  },
  {
    id: "sample-lapsed-vip",
    name: "Lapsed VIP Customers",
    source: "sample",
    memberCount: 912,
    description: "High-value customers who have not purchased recently."
  },
  {
    id: "sample-thca-shoppers",
    name: "THCA Flower Shoppers",
    source: "sample",
    memberCount: 4175,
    description: "Customers with THCA category interest."
  }
];

type AlpineAudienceRecord = {
  id?: string;
  _id?: string;
  uuid?: string;
  segmentId?: string;
  segment_id?: string;
  listId?: string;
  list_id?: string;
  audienceId?: string;
  audience_id?: string;
  name?: string;
  title?: string;
  label?: string;
  displayName?: string;
  display_name?: string;
  count?: number;
  memberCount?: number;
  member_count?: number;
  customerCount?: number;
  customer_count?: number;
  total?: number;
  description?: string;
};

export type AlpineAudienceResult = {
  audiences: AudienceSegment[];
  status: "sample" | "connected" | "not-configured" | "error";
  message?: string;
};

function normalizeRecord(record: AlpineAudienceRecord): AudienceSegment | null {
  const id =
    record.id ??
    record._id ??
    record.uuid ??
    record.segmentId ??
    record.segment_id ??
    record.listId ??
    record.list_id ??
    record.audienceId ??
    record.audience_id;
  const name = record.name ?? record.title ?? record.label ?? record.displayName ?? record.display_name;

  if (!id || !name) {
    return null;
  }

  return {
    id: String(id),
    name,
    source: "alpine-iq",
    memberCount:
      record.memberCount ?? record.member_count ?? record.customerCount ?? record.customer_count ?? record.count ?? record.total,
    description: record.description
  };
}

function getEndpointCandidates() {
  const configuredEndpoints = getServerEnv("ALPINE_IQ_AUDIENCES_ENDPOINTS");
  const legacyEndpoint = getServerEnv("ALPINE_IQ_AUDIENCES_ENDPOINT");
  const endpointList = configuredEndpoints ?? [legacyEndpoint, "audiences", "segments", "lists"].filter(Boolean).join(",");

  return endpointList
    .split(",")
    .map((endpoint) => endpoint.trim())
    .filter((endpoint, index, endpoints) => endpoint && endpoints.indexOf(endpoint) === index);
}

function extractRecords(body: unknown): AlpineAudienceRecord[] {
  if (Array.isArray(body)) {
    return body as AlpineAudienceRecord[];
  }

  if (!body || typeof body !== "object") {
    return [];
  }

  const responseBody = body as Record<string, unknown>;
  const possibleArrays = [
    responseBody.data,
    responseBody.segments,
    responseBody.audiences,
    responseBody.lists,
    responseBody.results,
    responseBody.items,
    responseBody.records
  ];

  for (const possibleArray of possibleArrays) {
    if (Array.isArray(possibleArray)) {
      return possibleArray as AlpineAudienceRecord[];
    }
  }

  if (responseBody.result && typeof responseBody.result === "object") {
    return extractRecords(responseBody.result);
  }

  return [];
}

function parseAlpineMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  if ("message" in body && typeof body.message === "string") {
    return body.message;
  }

  if ("error" in body && typeof body.error === "string") {
    return body.error;
  }

  if ("errors" in body && Array.isArray(body.errors)) {
    const firstError = body.errors[0];

    if (firstError && typeof firstError === "object" && "message" in firstError && typeof firstError.message === "string") {
      return firstError.message;
    }
  }

  return undefined;
}

export async function getAlpineAudienceResult(): Promise<AlpineAudienceResult> {
  const alpineIqUid = getServerEnv("ALPINE_IQ_UID");
  const apiKey = getServerEnv("ALPINE_IQ_API_KEY");
  const explicitApiUrl = getServerEnv("ALPINE_IQ_AUDIENCES_URL");
  const baseUrl = getServerEnv("ALPINE_IQ_BASE_URL") ?? "https://lab.alpineiq.com/api/v1.1";
  const endpointCandidates = explicitApiUrl ? ["custom-url"] : getEndpointCandidates();

  if ((!explicitApiUrl && !alpineIqUid) || !apiKey) {
    return {
      audiences: sampleAudiences,
      status: "sample",
      message: "Alpine IQ is not configured, so sample audiences are shown."
    };
  }

  const attemptedEndpoints: string[] = [];
  let lastMessage = "";

  for (const endpoint of endpointCandidates) {
    const apiUrl = explicitApiUrl ?? `${baseUrl}/${endpoint}/${alpineIqUid}`;
    attemptedEndpoints.push(endpoint);

    try {
      const response = await fetch(apiUrl, {
        headers: {
          accept: "application/json",
          "X-APIKEY": apiKey
        },
        cache: "no-store"
      });

      if (!response.ok) {
        let message = `Alpine IQ returned ${response.status}.`;

        try {
          message = parseAlpineMessage(await response.json()) ?? message;
        } catch {
          // Keep the status-only message if Alpine does not return JSON.
        }

        lastMessage = `${message} Tried endpoint "${endpoint}" for UID ${alpineIqUid}.`;
        continue;
      }

      const body = await response.json();
      const records = extractRecords(body);
      const audiences = records.map(normalizeRecord).filter(Boolean) as AudienceSegment[];

      if (!audiences.length) {
        lastMessage = `Connected to Alpine IQ, but endpoint "${endpoint}" returned no audience records.`;
        continue;
      }

      return {
        audiences,
        status: "connected"
      };
    } catch (error) {
      lastMessage = `Could not reach endpoint "${endpoint}": ${
        error instanceof Error ? error.message : "network request failed"
      }.`;
      continue;
    }
  }

  return {
    audiences: [],
    status: "error",
    message:
      lastMessage ||
      `Could not load Alpine IQ audiences. Tried ${attemptedEndpoints.join(", ")} for UID ${alpineIqUid}.`
  };
}

export async function getAlpineAudiences(): Promise<AudienceSegment[]> {
  const result = await getAlpineAudienceResult();
  return result.audiences;
}
