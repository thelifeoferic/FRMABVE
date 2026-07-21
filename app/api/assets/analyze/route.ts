import { NextResponse } from "next/server";
import type { CampaignAsset } from "@/lib/types/campaign";

type AnalyzeAssetsBody = {
  assets?: CampaignAsset[];
};

type OpenAIResponsesBody = {
  output_text?: string;
  error?: {
    message?: string;
  };
};

function fallbackSummary(asset: CampaignAsset) {
  return `${asset.name} is a ${asset.role} reference asset. Use its visible packaging, palette, product cues, and composition as creative direction.`;
}

async function analyzeAsset(asset: CampaignAsset): Promise<CampaignAsset> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!asset.dataUrl?.startsWith("data:image/")) {
    return {
      ...asset,
      analysisStatus: "ready",
      summary: fallbackSummary(asset)
    };
  }

  if (!apiKey) {
    return {
      ...asset,
      analysisStatus: "failed",
      summary: fallbackSummary(asset)
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                "Describe this campaign reference image for a designer generating new ecommerce/CRM campaign art.",
                "Focus on product packaging, color palette, fruit/flavor cues, composition, lighting, texture, and anything to preserve.",
                "Do not identify people. Keep it under 55 words."
              ].join(" ")
            },
            {
              type: "input_image",
              image_url: asset.dataUrl
            }
          ]
        }
      ]
    })
  });

  const body = (await response.json().catch(() => ({}))) as OpenAIResponsesBody;
  const summary = body.output_text?.trim();

  if (!response.ok || !summary) {
    return {
      ...asset,
      analysisStatus: "failed",
      summary: body.error?.message ? `${fallbackSummary(asset)} Analysis note: ${body.error.message}` : fallbackSummary(asset)
    };
  }

  return {
    ...asset,
    analysisStatus: "ready",
    summary
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as AnalyzeAssetsBody;
  const assets = body.assets ?? [];

  if (!assets.length) {
    return NextResponse.json({ assets: [] });
  }

  const analyzedAssets = await Promise.all(assets.map((asset) => analyzeAsset(asset)));

  return NextResponse.json({ assets: analyzedAssets });
}
