import { NextResponse } from "next/server";
import type { GeneratedImage } from "@/lib/types/campaign";

type GenerateImagesBody = {
  images?: GeneratedImage[];
};

type OpenAIImageResponse = {
  data?: Array<{
    b64_json?: string;
    revised_prompt?: string;
    url?: string;
  }>;
  error?: {
    message?: string;
  };
};

async function generateImage(image: GeneratedImage): Promise<GeneratedImage> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      ...image,
      status: "failed",
      error: "Missing OPENAI_API_KEY."
    };
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: image.prompt,
      size: "1024x1024",
      n: 1
    })
  });

  const body = (await response.json().catch(() => ({}))) as OpenAIImageResponse;
  const first = body.data?.[0];
  const imageUrl = first?.b64_json ? `data:image/png;base64,${first.b64_json}` : first?.url;

  if (!response.ok || !imageUrl) {
    return {
      ...image,
      status: "failed",
      error: body.error?.message ?? "OpenAI image generation failed."
    };
  }

  return {
    ...image,
    prompt: first?.revised_prompt ?? image.prompt,
    status: "generated",
    imageUrl
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as GenerateImagesBody;
  const images = body.images ?? [];

  if (!images.length) {
    return NextResponse.json({ error: "No image briefs provided." }, { status: 400 });
  }

  const generatedImages = await Promise.all(images.map((image) => generateImage(image)));

  return NextResponse.json({ images: generatedImages });
}
