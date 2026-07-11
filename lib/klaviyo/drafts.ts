import { getCampaignBrand } from "@/lib/brand/default-brand";
import { getServerEnv } from "@/lib/env/server-env";
import type { CampaignInput, CampaignStrategy, GeneratedImage, KlaviyoDraft, VisualConcept } from "@/lib/types/campaign";

type DraftRequest = {
  input: CampaignInput;
  strategy: CampaignStrategy;
  concept: VisualConcept;
  generatedImages: GeneratedImage[];
};

type KlaviyoAudienceResolution = {
  id: string;
  name: string;
  source: "selected" | "test-fallback";
};

function getKlaviyoPrivateApiKey(brandId: CampaignInput["brandId"]) {
  if (brandId === "plant-bar") {
    return getServerEnv("PLANT_BAR_KLAVIYO_PRIVATE_API_KEY");
  }

  return getServerEnv("ASHEVILLE_KLAVIYO_PRIVATE_API_KEY") ?? getServerEnv("KLAVIYO_PRIVATE_API_KEY");
}

function getSender(input: CampaignInput) {
  const brand = getCampaignBrand(input.brandId);

  if (brand.id === "asheville-dispensary") {
    return {
      fromName: input.fromName || brand.sample.fromName,
      fromEmail: "no-reply@avldispensary.com",
      replyToEmail: "support@avldispensary.com"
    };
  }

  return {
    fromName: input.fromName || brand.sample.fromName,
    fromEmail: input.fromEmail || brand.sample.fromEmail,
    replyToEmail: input.replyToEmail || input.fromEmail || brand.sample.replyToEmail
  };
}

export function buildKlaviyoCampaignPayload(
  input: CampaignInput,
  strategy: CampaignStrategy,
  concept: VisualConcept,
  generatedImages: GeneratedImage[] = [],
  audience?: KlaviyoAudienceResolution
) {
  const brand = getCampaignBrand(input.brandId);
  const campaignName = input.campaignName || `${input.products || brand.name} Campaign`;
  const { fromName, fromEmail, replyToEmail } = getSender(input);
  const safeCampaignName = campaignName.toLowerCase().includes("do not send")
    ? campaignName
    : `${campaignName} - Draft Test - Do Not Send`;
  const includedAudiences = audience?.id ? [audience.id] : [];

  return {
    data: {
      type: "campaign",
      attributes: {
        name: safeCampaignName,
        audiences: {
          included: includedAudiences
        },
        "campaign-messages": {
          data: [
            {
              type: "campaign-message",
              attributes: {
                definition: {
                  channel: "email",
                  label: `${safeCampaignName} Email`,
                  content: {
                    subject: input.subjectLine || strategy.headline,
                    preview_text: input.previewText || strategy.subheadline,
                    from_label: fromName,
                    from_email: fromEmail,
                    reply_to_email: replyToEmail
                  }
                }
              }
            }
          ]
        }
      }
    }
  };
}

export function buildCampaignStudioPackage(
  input: CampaignInput,
  strategy: CampaignStrategy,
  concept: VisualConcept,
  generatedImages: GeneratedImage[] = []
) {
  const brand = getCampaignBrand(input.brandId);
  const campaignName = input.campaignName || `${input.products || brand.name} Campaign`;
  const products = input.products.split(",").map((product) => product.trim()).filter(Boolean);
  const testReviewDate = "2026-08-22";
  const sender = getSender(input);
  const imageGenerationBrief = {
    owner: "OpenAI Images API recommended; pending API key and generation endpoint",
    style: concept.name,
    prompt: [
      `Create a ${concept.name.toLowerCase()} campaign hero for ${brand.name}.`,
      `Products: ${products.join(", ") || `selected ${brand.name} offerings`}.`,
      `Visual direction: ${concept.direction}`,
      `Photography direction: ${strategy.photographyDirection}`,
      `Brand treatment: ${strategy.colorTreatment}`,
      input.includeLogo ? `Logo treatment: include ${brand.name} logo in the design.` : "Logo treatment: no logo in the image design.",
      input.assetNotes ? `Asset notes: ${input.assetNotes}` : ""
    ]
      .filter(Boolean)
      .join(" "),
    requiredAssets: input.assets.map((asset) => ({
      name: asset.name,
      role: asset.role,
      fileType: asset.fileType,
      size: asset.size
    }))
  };
  const emailDraft = {
    subjectLine: input.subjectLine || strategy.headline,
    previewText: input.previewText || strategy.subheadline,
    campaignName,
    hero: {
      headline: strategy.headline,
      body: strategy.supportingCopy,
      imageBrief: imageGenerationBrief,
      generatedImages,
      cta: strategy.cta
    },
    sections: strategy.sections,
    footerNotes: input.notes
  };

  return {
    brand: {
      id: brand.id,
      name: brand.name,
      url: brand.url
    },
    audience: {
      id: input.audienceId,
      name: input.audience
    },
    emailDraft,
    sender,
    safety: {
      mode: "draft-only-test",
      mustNotSend: true,
      reviewDate: testReviewDate,
      note: "Test campaign only. Do not publish, schedule, or send."
    },
    creative: {
      subjectLine: input.subjectLine || strategy.headline,
      previewText: input.previewText || strategy.subheadline,
      cta: strategy.cta,
      concept: concept.name,
      products,
      notes: input.notes,
      attachedAssets: input.assets,
      includeLogo: input.includeLogo,
      imageGenerationBrief,
      generatedImages
    }
  };
}

export function createMockKlaviyoDraft(
  input: CampaignInput,
  strategy: CampaignStrategy,
  concept: VisualConcept,
  generatedImages: GeneratedImage[] = [],
  integrationMessage = "Klaviyo was not called. This is a local dry-run package."
): KlaviyoDraft {
  const brand = getCampaignBrand(input.brandId);

  return {
    id: `kl_${concept.id}_draft`,
    status: "dry-run",
    subjectLine: input.subjectLine || strategy.headline,
    previewText: input.previewText || strategy.subheadline,
    campaignName: input.campaignName || brand.sample.campaignName,
    audienceName: input.audience || "Audience pending",
    productNames: input.products.split(",").map((product) => product.trim()).filter(Boolean),
    assetCount: input.assets.length,
    imageCount: generatedImages.length,
    imageGenerationOwner: "OpenAI Images API recommended; not connected yet",
    integrationMessage,
    payload: {
      klaviyoCreatePayload: buildKlaviyoCampaignPayload(input, strategy, concept, generatedImages),
      campaignStudioPackage: buildCampaignStudioPackage(input, strategy, concept, generatedImages)
    }
  };
}

async function resolveKlaviyoAudience(input: CampaignInput): Promise<KlaviyoAudienceResolution> {
  const klaviyoAudienceId = input.klaviyoAudienceId?.trim();

  if (klaviyoAudienceId) {
    return {
      id: klaviyoAudienceId,
      name: input.audience ? `${input.audience} / Klaviyo ${klaviyoAudienceId}` : `Klaviyo ${klaviyoAudienceId}`,
      source: "selected"
    };
  }

  if (input.audienceId && !input.audienceId.startsWith("sample-")) {
    return {
      id: input.audienceId,
      name: input.audience || input.audienceId,
      source: "selected"
    };
  }

  return {
    id: getServerEnv("KLAVIYO_TEST_AUDIENCE_ID") ?? "320400",
    name: "Klaviyo Test Audience 320400",
    source: "test-fallback"
  };
}

export async function createKlaviyoDraft({ input, strategy, concept, generatedImages }: DraftRequest): Promise<KlaviyoDraft> {
  const brand = getCampaignBrand(input.brandId);
  const apiKey = getKlaviyoPrivateApiKey(input.brandId);
  const revision = getServerEnv("KLAVIYO_REVISION") ?? "2026-04-15";

  if (!apiKey) {
    return createMockKlaviyoDraft(input, strategy, concept, generatedImages, `No ${brand.name} Klaviyo private API key is configured, so nothing was created in Klaviyo.`);
  }

  let audience: KlaviyoAudienceResolution;

  try {
    audience = await resolveKlaviyoAudience(input);
  } catch (error) {
    return createMockKlaviyoDraft(
      input,
      strategy,
      concept,
      generatedImages,
      `Klaviyo audience lookup failed: ${error instanceof Error ? error.message : "Unknown audience lookup error."}`
    );
  }

  const payload = buildKlaviyoCampaignPayload(input, strategy, concept, generatedImages, audience);

  const response = await fetch("https://a.klaviyo.com/api/campaigns", {
    method: "POST",
    headers: {
      accept: "application/vnd.api+json",
      authorization: `Klaviyo-API-Key ${apiKey}`,
      "content-type": "application/vnd.api+json",
      revision
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const firstError = Array.isArray(body?.errors) ? body.errors[0] : undefined;
    const errorText =
      firstError?.detail ??
      firstError?.title ??
      body?.message ??
      `Klaviyo returned HTTP ${response.status}.`;

    return {
      ...createMockKlaviyoDraft(
        input,
        strategy,
        concept,
        generatedImages,
        `Klaviyo rejected the draft request: ${errorText}`
      ),
      status: "dry-run",
      payload: {
        attemptedPayload: payload,
        campaignStudioPackage: buildCampaignStudioPackage(input, strategy, concept, generatedImages),
        klaviyoError: body
      }
    };
  }

  return {
    id: body?.data?.id ?? `kl_${concept.id}_draft`,
    status: "klaviyo-draft",
    subjectLine: input.subjectLine || strategy.headline,
    previewText: input.previewText || strategy.subheadline,
    campaignName: input.campaignName || `${brand.name} Campaign`,
    audienceName: audience.name,
    productNames: input.products.split(",").map((product) => product.trim()).filter(Boolean),
    assetCount: input.assets.length,
    imageCount: generatedImages.length,
    imageGenerationOwner: "OpenAI Images API recommended; not connected yet",
    integrationMessage:
      audience.source === "test-fallback"
        ? `Created in Klaviyo as a draft-only test campaign using test audience ${audience.id}. It was not scheduled or sent.`
        : "Created in Klaviyo as a draft-only test campaign. It was not scheduled or sent.",
    klaviyoCampaignId: body?.data?.id,
    payload: {
      klaviyoCreatePayload: payload,
      campaignStudioPackage: buildCampaignStudioPackage(input, strategy, concept, generatedImages)
    }
  };
}
