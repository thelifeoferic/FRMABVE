import { getCampaignBrand } from "@/lib/brand/default-brand";
import type { CampaignInput } from "@/lib/types/campaign";

const brandImageGuidelines = {
  "asheville-dispensary": [
    "Use a premium cannabis apothecary look with cream, black, deep green, and warm gold.",
    "Keep product packaging readable, centered, and fully inside the image with generous margin.",
    "Use natural shadows, restrained offer hierarchy, and product-forward composition."
  ],
  "plant-bar": [
    "Honor the Plant Bar guide: soft mint backgrounds, blush pink brand energy, deep navy contrast, cocoa-brown warmth, and tea/coffee amber accents.",
    "Use an editorial cafe and botanical beverage style: specialty coffee, tea, boba, zero-proof cocktails, glassware, garnish, texture, and warm human connection.",
    "Typography direction should feel like bold Archivo for clear labels paired with refined Scotch-style editorial serif or warm hand-script energy when text is needed.",
    "Avoid cannabis dispensary visual language, neon lounge styling, heavy black packaging scenes, or loud sales graphics for Plant Bar.",
    "Keep the composition airy, intentional, crafted, and mood-led, with logo use restrained and premium."
  ]
};

export function buildCampaignDirectorPrompt(input: CampaignInput) {
  const brand = getCampaignBrand(input.brandId);

  return `You are the Creative Director for ${brand.name} Campaign Studio.

Create one premium Klaviyo email campaign strategy from this marketing request.

Brand: ${brand.name}
Campaign Name: ${input.campaignName}
Products: ${input.products}
Offer: ${input.offer}
Audience: ${input.audience}
Tone: ${input.tone}
Objective: ${input.objective}
CTA: ${input.cta}
Notes: ${input.notes}
Brand image rules: ${brandImageGuidelines[brand.id].join(" ")}

Return campaign strategy, headline, subheadline, supporting copy, sections, CTA,
recommended layout, photography direction, color treatment, and visual hierarchy.`;
}
