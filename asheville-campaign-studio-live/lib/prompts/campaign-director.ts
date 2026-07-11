import { getCampaignBrand } from "@/lib/brand/default-brand";
import type { CampaignInput } from "@/lib/types/campaign";

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
Brand image rules: ${brand.imageGuidelines.join(" ")}

Return campaign strategy, headline, subheadline, supporting copy, sections, CTA,
recommended layout, photography direction, color treatment, and visual hierarchy.`;
}
