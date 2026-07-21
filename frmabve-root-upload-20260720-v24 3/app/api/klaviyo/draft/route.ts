import { NextResponse } from "next/server";
import { createKlaviyoDraft } from "@/lib/klaviyo/drafts";
import type { CampaignInput, CampaignStrategy, GeneratedImage, VisualConcept } from "@/lib/types/campaign";

type DraftBody = {
  input?: CampaignInput;
  strategy?: CampaignStrategy;
  concept?: VisualConcept;
  generatedImages?: GeneratedImage[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as DraftBody;

  if (!body.input || !body.strategy || !body.concept) {
    return NextResponse.json({ error: "Missing campaign input, strategy, or concept." }, { status: 400 });
  }

  const draft = await createKlaviyoDraft({
    input: body.input,
    strategy: body.strategy,
    concept: body.concept,
    generatedImages: body.generatedImages ?? []
  });

  return NextResponse.json({ draft });
}
