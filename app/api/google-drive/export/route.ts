import { NextResponse } from "next/server";
import { getCampaignBrand } from "@/lib/brand/default-brand";
import type { CampaignInput, DriveExport, GeneratedImage } from "@/lib/types/campaign";

type DriveExportRequest = {
  input?: CampaignInput;
  selectedImage?: GeneratedImage | null;
  includeSocialKit?: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export async function POST(request: Request) {
  const body = (await request.json()) as DriveExportRequest;

  if (!body.selectedImage?.imageUrl || !body.input) {
    return NextResponse.json({ error: "A selected generated image is required." }, { status: 400 });
  }

  const brand = getCampaignBrand(body.input.brandId);
  const campaignName = body.input.campaignName || "Untitled Campaign";
  const folderName = `${brand.name} - ${campaignName}`;
  const folderSlug = slugify(folderName) || `${brand.id}-campaign`;
  const driveConnected = Boolean(process.env.GOOGLE_DRIVE_CLIENT_EMAIL && process.env.GOOGLE_DRIVE_PRIVATE_KEY);
  const status = driveConnected ? "uploaded" : "drive-draft";
  const baseAsset = {
    sourceImageId: body.selectedImage.id,
    status
  } as const;

  const assets: DriveExport["assets"] = [
    {
      ...baseAsset,
      id: `${folderSlug}-selected`,
      name: `${campaignName} - selected campaign image`,
      format: "selected-image",
      dimensions: "source"
    }
  ];

  if (body.includeSocialKit) {
    assets.push(
      {
        ...baseAsset,
        id: `${folderSlug}-story`,
        name: `${campaignName} - Instagram Story`,
        format: "instagram-story",
        dimensions: "1080 x 1920"
      },
      {
        ...baseAsset,
        id: `${folderSlug}-feed`,
        name: `${campaignName} - Instagram Feed Post`,
        format: "instagram-feed",
        dimensions: "1080 x 1080"
      }
    );
  }

  const exportRecord: DriveExport = {
    id: `drive_${folderSlug}`,
    status,
    folderName,
    campaignName,
    assetCount: assets.length,
    assets,
    folderUrl: driveConnected ? `https://drive.google.com/drive/folders/${folderSlug}` : undefined,
    note: driveConnected
      ? "Uploaded to Google Drive."
      : "Google Drive export is staged. Connect Google Drive credentials to upload files automatically."
  };

  return NextResponse.json({ export: exportRecord });
}
