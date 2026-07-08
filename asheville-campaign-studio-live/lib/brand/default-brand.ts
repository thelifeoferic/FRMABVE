import type { BrandId } from "@/lib/types/campaign";

export type CampaignBrand = {
  id: BrandId;
  name: string;
  shortName: string;
  url: string;
  promise: string;
  voice: string[];
  defaultAudience: string;
  logoSrc: string;
  heroSrc: string;
  heroAlt: string;
  productSearchLabel: string;
  productSearchPlaceholder: string;
  productEmpty: string;
  imagePromptBrand: string;
  logoPrompt: string;
  sample: {
    campaignName: string;
    subjectLine: string;
    previewText: string;
    products: string;
    offer: string;
    cta: string;
    assetNotes: string;
    tone: string;
    objective: string;
    notes: string;
  };
};

export const campaignBrands: Record<BrandId, CampaignBrand> = {
  "asheville-dispensary": {
    id: "asheville-dispensary",
    name: "Asheville Dispensary",
    shortName: "Asheville",
    url: "https://avldispensary.com/",
    promise: "Cannabis, apothecary, and lounge campaigns built from real audience and product data.",
    voice: ["Pure", "Potent", "Craft", "Local"],
    defaultAudience: "Edible Customers",
    logoSrc: "/brand-imagery/ad-logo.png",
    heroSrc: "/brand-imagery/design-studio.webp",
    heroAlt: "Asheville Dispensary campaign studio hero",
    productSearchLabel: "Asheville Dispensary Products",
    productSearchPlaceholder: "Start typing gummies, THCA, seltzer, tinctures...",
    productEmpty: "Start typing to pull matching Asheville Dispensary products.",
    imagePromptBrand: "Asheville Dispensary",
    logoPrompt: "Include the Asheville Dispensary logo as a tasteful brand mark integrated into the design.",
    sample: {
      campaignName: "SOHI Social Gummies Launch",
      subjectLine: "Buy 2 Get 1 on SOHI Social Gummies",
      previewText: "A relaxed edible campaign for discovering Pineapple Passionfruit and Black Cherry gummies.",
      products: "SOHI Social Gummies: Pineapple Passionfruit, Black Cherry",
      offer: "Buy 2 Get 1",
      cta: "Shop Gummies",
      assetNotes: "Use the Asheville Dispensary mark as the brand anchor. Keep generated imagery compliant, product-forward, and premium.",
      tone: "Premium, relaxed, modern, natural",
      objective: "Drive product discovery and first purchase",
      notes: "Create a premium campaign for our new SOHI Social Gummies. Highlight Pineapple Passionfruit and Black Cherry."
    }
  },
  "plant-bar": {
    id: "plant-bar",
    name: "Plant Bar",
    shortName: "Plant Bar",
    url: "https://visitplantbar.com/",
    promise: "Specialty coffee, tea, boba, and zero-proof campaigns crafted around mood, connection, and intention.",
    voice: ["Botanical", "Intentional", "Warm", "Crafted"],
    defaultAudience: "Newsletter Subscribers",
    logoSrc: "https://visitplantbar.com/__l5e/assets-v1/b4f25d7c-e256-4feb-8381-6da7984cbc3c/plantbar-logo.png",
    heroSrc: "https://visitplantbar.com/__l5e/assets-v1/4d0a12d3-c94d-45e5-8beb-5d3841d98fe0/hero.jpg",
    heroAlt: "Inside Plant Bar, friends sharing coffee",
    productSearchLabel: "Plant Bar Offerings",
    productSearchPlaceholder: "Start typing coffee, boba, tea, zero-proof...",
    productEmpty: "Start typing to pull matching Plant Bar offerings.",
    imagePromptBrand: "Plant Bar",
    logoPrompt: "Include the Plant Bar logo as a tasteful brand mark integrated into the design.",
    sample: {
      campaignName: "Plant Bar Summer Seasonal",
      subjectLine: "Fresh summer pours at Plant Bar",
      previewText: "Honey, citrus, mint, hibiscus, and rose for the mood you are in.",
      products: "Summer Seasonal Menu, Botanical Zero-Proof Cocktails, Boba Tea",
      offer: "Summer seasonal menu",
      cta: "View Menu",
      assetNotes: "Use warm cafe light, botanical ingredients, intentional gathering, and crafted non-alcoholic drinks as the creative anchors.",
      tone: "Warm, botanical, intentional, lightly playful",
      objective: "Drive menu exploration and location visits",
      notes: "Create a summer campaign for Plant Bar around specialty coffee, tea, boba, and zero-proof cocktails crafted for every mood."
    }
  }
};

export const defaultBrand = campaignBrands["asheville-dispensary"];

export function getCampaignBrand(brandId: BrandId | undefined) {
  return campaignBrands[brandId ?? "asheville-dispensary"] ?? defaultBrand;
}
