import { NextResponse } from "next/server";
import type { GeneratedImage } from "@/lib/types/campaign";

export const runtime = "nodejs";

type EditImageBody = {
  image?: GeneratedImage | null;
  editPrompt?: string;
  output?: "square" | "story" | "wide";
};

type OpenAIImageResponse = {
  data?: Array<{ b64_json?: string; revised_prompt?: string; url?: string }>;
  error?: { message?: string };
};

const outputSizes: Record<NonNullable<EditImageBody["output"]>, string> = {
  square: "1024x1024",
  story: "1024x1536",
  wide: "1536x1024"
};

function dataUrlToBlob(dataUrl: string) {
  const [metadata, base64Payload] = dataUrl.split(",");
  const mimeMatch = metadata.match(/^data:(.+);base64$/);
  const mimeType = mimeMatch?.[1] ?? "image/png";
  const bytes = Buffer.from(base64Payload ?? "", "base64");

  return new Blob([bytes], { type: mimeType });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 400 });
  }

  const body = (await request.json()) as EditImageBody;
  const sourceImage = body.image;
  const editPrompt = body.editPrompt?.trim();

  if (!sourceImage?.imageUrl) {
    return NextResponse.json({ error: "Select a generated image before editing." }, { status: 400 });
  }

  if (!editPrompt) {
    return NextResponse.json({ error: "Add an edit request before creating a variant." }, { status: 400 });
  }

  if (!sourceImage.imageUrl.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "This editor currently needs a generated image data URL as the source image." },
      { status: 400 }
    );
  }

  const requestedOutput = body.output ?? "square";
  const prompt = [
    sourceImage.prompt,
    "Edit the provided campaign image according to this marketer request:",
    editPrompt,
    "Preserve product truth, brand logo integrity, original aspect ratio intent, and all readable packaging details unless the request explicitly asks otherwise."
  ].join(" ");

  const formData = new FormData();
  formData.set("model", process.env.OPENAI_IMAGE_EDIT_MODEL ?? "gpt-image-1");
  formData.set("image", dataUrlToBlob(sourceImage.imageUrl), "selected-campaign-image.png");
  formData.set("prompt", prompt);
  formData.set("size", outputSizes[requestedOutput]);
  formData.set("n", "1");

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`
    },
    body: formData
  });

  const responseBody = (await response.json().catch(() => ({}))) as OpenAIImageResponse;
  const firstImage = responseBody.data?.[0];
  const imageUrl = firstImage?.b64_json ? `data:image/png;base64,${firstImage.b64_json}` : firstImage?.url;

  if (!response.ok || !imageUrl) {
    return NextResponse.json(
      { error: responseBody.error?.message ?? "OpenAI image edit failed." },
      { status: response.ok ? 502 : response.status }
    );
  }

  const editedImage: GeneratedImage = {
    ...sourceImage,
    id: `${sourceImage.id}-edit-${Date.now()}`,
    status: "generated",
    prompt: firstImage?.revised_prompt ?? prompt,
    altText: `${sourceImage.altText} Edited variant.`,
    imageUrl,
    error: undefined
  };

  return NextResponse.json({ image: editedImage });
}
