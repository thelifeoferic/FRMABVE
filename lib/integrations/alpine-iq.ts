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
  segmentId?: string;
  segment_id?: string;
  listId?: string;
  list_id?: string;
  audienceId?: string;
  audience_id?: string;
  name?: string;
  title?: string;
  label?: string;
  count?: number;
  memberCount?: number;
  member_count?: number;
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
    record.segmentId ??
    record.segment_id ??
    record.listId ??
    record.list_id ??
    record.audienceId ??
    record.audience_id;
  const name = record.name ?? record.title ?? record.label;

  if (!id || !name) {
    return null;
  }

  return {
    id: String(id),
    name,
    source: "alpine-iq",
    memberCount: record.memberCount ?? record.member_count ?? record.count ?? record.total,
    description: record.description
  };
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
  const endpoint = getServerEnv("ALPINE_IQ_AUDIENCES_ENDPOINT") ?? "audiences";
  const apiUrl =
    getServerEnv("ALPINE_IQ_AUDIENCES_URL") ??
    (alpineIqUid
      ? `${getServerEnv("ALPINE_IQ_BASE_URL") ?? "https://lab.alpineiq.com/api/v1.1"}/${endpoint}/${alpineIqUid}`
      : undefined);
  const apiKey = getServerEnv("ALPINE_IQ_API_KEY");

  if (!apiUrl || !apiKey) {
    return {
      audiences: sampleAudiences,
      status: "sample",
      message: "Alpine IQ is not configured, so sample audiences are shown."
    };
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey
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

      return {
        audiences: [],
        status: "error",
        message: `${message} Tried endpoint "${endpoint}" for UID ${alpineIqUid}.`
      };
    }

    const body = await response.json();
    const records = Array.isArray(body)
      ? body
      : body.data ?? body.segments ?? body.audiences ?? body.lists ?? body.results ?? [];
    const audiences = records.map(normalizeRecord).filter(Boolean) as AudienceSegment[];

    return {
      audiences,
      status: "connected",
      message: audiences.length ? undefined : `Connected to Alpine IQ, but endpoint "${endpoint}" returned no audience records.`
    };
  } catch {
    return {
      audiences: [],
      status: "error",
      message: `Could not reach Alpine IQ endpoint "${endpoint}" for UID ${alpineIqUid}.`
    };
  }
}

export async function getAlpineAudiences(): Promise<AudienceSegment[]> {
  const result = await getAlpineAudienceResult();
  return result.audiences;
}
