export type BrandId = "asheville-dispensary" | "plant-bar";

export type CampaignInput = {
  brandId: BrandId;
  campaignName: string;
  subjectLine: string;
  previewText: string;
  products: string;
  productIds: string[];
  assets: CampaignAsset[];
  assetNotes: string;
  includeLogo: boolean;
  offer: string;
  audience: string;
  audienceId: string;
  klaviyoAudienceId: string;
  tone: string;
  objective: string;
  cta: string;
  notes: string;
};

export type CampaignAsset = {
  id: string;
  name: string;
  role: "product" | "brand" | "lifestyle" | "reference";
  fileType: string;
  size: number;
  dataUrl?: string;
  summary?: string;
  analysisStatus?: "pending" | "ready" | "failed";
};

export type AudienceSegment = {
  id: string;
  name: string;
  source: "alpine-iq" | "sample";
  memberCount?: number;
  description?: string;
};

export type ProductOption = {
  id: string;
  name: string;
  source: BrandId;
  category?: string;
  price?: string;
  url?: string;
};

export type CampaignStrategy = {
  headline: string;
  subheadline: string;
  supportingCopy: string;
  sections: string[];
  cta: string;
  recommendedLayout: string;
  photographyDirection: string;
  colorTreatment: string;
  visualHierarchy: string;
};

export type VisualConcept = {
  id: string;
  name: string;
  direction: string;
  layout: string;
  palette: string[];
  hero: string;
  heroImage: string;
  treatment: "cream" | "orchard" | "night";
};

export type GeneratedImage = {
  id: string;
  style: "Product" | "Wellness" | "Lifestyle";
  version: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  status: "preview" | "brief-ready" | "generating" | "generated" | "failed" | "approved";
  prompt: string;
  altText: string;
  assetRoles: CampaignAsset["role"][];
  treatment: VisualConcept["treatment"];
  imageUrl?: string;
  error?: string;
};

export type KlaviyoDraft = {
  id: string;
  status: "ready" | "klaviyo-draft" | "dry-run";
  subjectLine: string;
  previewText: string;
  campaignName: string;
  audienceName: string;
  productNames: string[];
  assetCount: number;
  imageCount: number;
  imageGenerationOwner: string;
  integrationMessage?: string;
  klaviyoCampaignId?: string;
  payload?: unknown;
};

export type DriveKitAsset = {
  id: string;
  name: string;
  format: "selected-image" | "instagram-story" | "instagram-feed";
  dimensions: string;
  sourceImageId: string;
  status: "ready" | "drive-draft" | "uploaded";
};

export type DriveExport = {
  id: string;
  status: "ready" | "drive-draft" | "uploaded";
  folderName: string;
  campaignName: string;
  assetCount: number;
  assets: DriveKitAsset[];
  note: string;
  folderUrl?: string;
};
