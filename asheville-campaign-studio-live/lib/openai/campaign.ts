import { getCampaignBrand } from "@/lib/brand/default-brand";
import type { CampaignInput, CampaignStrategy, GeneratedImage, VisualConcept } from "@/lib/types/campaign";

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

export function createMockKlaviyoFields(input: CampaignInput) {
  const brand = getCampaignBrand(input.brandId);
  const product = input.products.split(",")[0]?.trim() || input.campaignName || brand.name;
  const offer = input.offer.trim();
  const audience = input.audience.trim();

  return {
    subjectLine: offer ? `${offer} on ${product}` : `Fresh picks from ${product}`,
    previewText: audience
      ? `Built for ${audience.toLowerCase()}: ${input.notes || `shop the latest ${brand.name} campaign.`}`
      : input.notes || `Shop a fresh ${brand.name} campaign, staged for one final human review.`
  };
}

export function createMockStrategy(input: CampaignInput): CampaignStrategy {
  const brand = getCampaignBrand(input.brandId);
  const product = input.products || brand.sample.products;
  const cta = input.cta || brand.sample.cta;

  if (brand.id === "plant-bar") {
    return {
      headline: product.toLowerCase().includes("summer") ? "Sip The Season" : `Meet ${product}`,
      subheadline: "Crafted drinks for every mood.",
      supportingCopy:
        "A warm, botanical campaign that makes the menu feel thoughtful, social, and easy to explore.",
      sections: [
        "Hero with one strong drink moment and restrained copy",
        "Menu row featuring specialty coffee, tea, boba, and zero-proof cocktails",
        "Mood-led block with botanical ingredients and occasion cues",
        "Final visit CTA for Asheville and Chattanooga guests"
      ],
      cta,
      recommendedLayout:
        "Single-column Klaviyo email with a polished drink hero, compact menu modules, and a simple location-aware CTA.",
      photographyDirection:
        "Warm cafe light, botanical garnishes, glassware, tea texture, crafted drink details, and human gathering cues.",
      colorTreatment:
        "Cream and warm botanical foundation with leafy green, blush, tea amber, and dark espresso accents.",
      visualHierarchy:
        "Drink first, mood second, menu proof third, visit CTA fourth, with one clear conversion path."
    };
  }

  return {
    headline: product.toLowerCase().includes("sohi")
      ? "Meet The Social Gummy"
      : `Meet ${product}`,
    subheadline: "Designed for conversation.",
    supportingCopy:
      "A relaxed, premium campaign that makes the offer feel generous without making the brand feel loud.",
    sections: [
      "Hero with large product photography and restrained copy",
      "Flavor row featuring Pineapple Passionfruit and Black Cherry",
      "Offer block with a clean Buy 2 Get 1 treatment",
      "Final conversion CTA for edible customers"
    ],
    cta,
    recommendedLayout:
      "Single-column Klaviyo email with a spacious hero, two flavor modules, and a compact offer band.",
    photographyDirection:
      "Warm cream studio surface, soft daylight, package-forward composition, fruit cues, and natural shadows.",
    colorTreatment:
      "Cream foundation with Asheville black, deep green, warm gold, and restrained apothecary accents.",
    visualHierarchy:
      "Product first, headline second, flavor proof third, offer fourth, CTA repeated at top and bottom."
  };
}

export function createMockConcepts(): VisualConcept[] {
  return [
    {
      id: "cream-studio",
      name: "Product",
      direction: "Package-forward product portrait with clean negative space and clear offer hierarchy.",
      layout: "Centered hero, editorial fruit details, restrained offer band.",
      palette: ["#f8f4ec", "#c9a24a", "#171717", "#315f34"],
      hero: "Large product photography on a warm cream background.",
      heroImage: "/brand-imagery/jar-flower.jpg",
      treatment: "cream"
    },
    {
      id: "orchard-table",
      name: "Wellness",
      direction: "Apothecary-led story with calm rituals, plant cues, and benefits framed with restraint.",
      layout: "Balanced product stack, benefit modules, soft apothecary texture.",
      palette: ["#f3ead7", "#315f34", "#c9a24a", "#171717"],
      hero: "Product, botanical cues, and wellness benefit arranged like a premium apothecary shoot.",
      heroImage: "/brand-imagery/wellness-joint.jpg",
      treatment: "orchard"
    },
    {
      id: "social-night",
      name: "Lifestyle",
      direction: "Human occasion campaign built around lounge energy, connection, and easy discovery.",
      layout: "Dark green hero field, warm accent details, confident CTA block.",
      palette: ["#171717", "#1f3f21", "#c9a24a", "#f8f4ec"],
      hero: "Polished lounge mood without clutter.",
      heroImage: "/brand-imagery/lounge-neon.jpg",
      treatment: "night"
    }
  ];
}

export function createMockImageSet(
  input: CampaignInput,
  strategy: CampaignStrategy,
  concepts: VisualConcept[]
): GeneratedImage[] {
  const brand = getCampaignBrand(input.brandId);
  const productText = input.products || `selected ${brand.name} offerings`;
  const brandGuidelines = brandImageGuidelines[brand.id].join(" ");
  const plantBarPalettes: Record<VisualConcept["name"], string[]> = {
    Product: ["#e5f5ef", "#ffa2a8", "#061f33", "#704f49", "#d9a45f"],
    Wellness: ["#e5f5ef", "#704f49", "#061f33", "#ffa2a8", "#f4efe6"],
    Lifestyle: ["#f4efe6", "#061f33", "#ffa2a8", "#704f49", "#d9a45f"]
  };
  const assetRoles = Array.from(new Set(input.assets.map((asset) => asset.role)));
  const assetSummary = input.assets
    .map((asset) => {
      const summary = asset.summary?.trim();
      return summary ? `${asset.role} asset ${asset.name}: ${summary}` : `${asset.role} asset ${asset.name}`;
    })
    .join(" ");
  const imagePlan: Array<{ concept: VisualConcept; version: GeneratedImage["version"]; angle: string }> = [
    { concept: concepts[0], version: "A", angle: "premium package-forward hero" },
    { concept: concepts[0], version: "B", angle: "close-up product and offer composition" },
    { concept: concepts[0], version: "C", angle: "clean product detail with strong negative space" },
    { concept: concepts[1], version: "D", angle: "calm apothecary ritual" },
    { concept: concepts[1], version: "E", angle: "plant-led wellness detail" },
    { concept: concepts[1], version: "F", angle: "soft lifestyle wellness tabletop" },
    { concept: concepts[2], version: "G", angle: "warm lounge occasion" },
    { concept: concepts[2], version: "H", angle: "human discovery moment" }
  ];

  return imagePlan.map(({ concept, version, angle }) => {
    const palette = brand.id === "plant-bar" ? plantBarPalettes[concept.name] : concept.palette;

    return {
      id: `${concept.id}-${version.toLowerCase()}`,
      style: concept.name as GeneratedImage["style"],
      version,
      status: "brief-ready",
      prompt: [
        `${concept.name} image option ${version} for a ${brand.name} Klaviyo email campaign.`,
        `Creative angle: ${angle}.`,
        `Feature ${productText}.`,
        `Campaign headline: ${strategy.headline}.`,
        `Direction: ${concept.direction}`,
        `Layout: ${concept.layout}`,
        `Use brand palette ${palette.join(", ")}.`,
        `Brand guide rules: ${brandGuidelines}`,
        input.includeLogo
          ? brand.logoPrompt
          : `Do not include the ${brand.name} logo in the generated image.`,
        assetSummary ? `Use these analyzed visual references: ${assetSummary}` : "",
        input.assetNotes ? `Reference notes: ${input.assetNotes}` : "Use attached assets as brand and product references."
      ]
        .filter(Boolean)
        .join(" "),
      altText: `${concept.name} campaign image for ${productText}`,
      assetRoles: assetRoles.length ? assetRoles : ["brand", "product"],
      treatment: concept.treatment
    };
  });
}
