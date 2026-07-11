"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApprovalPanel } from "@/components/ApprovalPanel/ApprovalPanel";
import { ImageSetPanel } from "@/components/ImageGeneration/ImageSetPanel";
import { PromptBox } from "@/components/PromptBox/PromptBox";
import { SocialKitPanel } from "@/components/SocialKit/SocialKitPanel";
import { campaignBrands, getCampaignBrand } from "@/lib/brand/default-brand";
import { createMockConcepts, createMockImageSet, createMockKlaviyoFields, createMockStrategy } from "@/lib/openai/campaign";
import type {
  AudienceSegment,
  BrandId,
  CampaignInput,
  CampaignStrategy,
  DriveExport,
  GeneratedImage,
  KlaviyoDraft,
  ProductOption
} from "@/lib/types/campaign";
import type { RefObject } from "react";

const initialInput: CampaignInput = {
  brandId: "asheville-dispensary",
  campaignName: "",
  subjectLine: "",
  previewText: "",
  products: "",
  productIds: [],
  assets: [],
  assetNotes: "",
  includeLogo: true,
  offer: "",
  audience: "",
  audienceId: "",
  klaviyoAudienceId: "",
  tone: "",
  objective: "",
  cta: "",
  notes: ""
};

const steps = ["Brief", "Klaviyo Fields", "Images", "Review", "Klaviyo Draft"];
const similarVariants: GeneratedImage["version"][] = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function CampaignStudio() {
  const [input, setInput] = useState<CampaignInput>(initialInput);
  const selectedBrand = getCampaignBrand(input.brandId);
  const [strategy, setStrategy] = useState<CampaignStrategy | null>(null);
  const concepts = useMemo(() => createMockConcepts(), []);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [draft, setDraft] = useState<KlaviyoDraft | null>(null);
  const [driveExport, setDriveExport] = useState<DriveExport | null>(null);
  const [audiences, setAudiences] = useState<AudienceSegment[]>([]);
  const [audienceStatus, setAudienceStatus] = useState<string>("");
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loadingAudiences, setLoadingAudiences] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [exportingDrive, setExportingDrive] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);

  const selectedConcept =
    concepts.find((concept) => concept.id === selectedConceptId) ??
    concepts.find((concept) => concept.name === generatedImages.find((image) => image.id === selectedImageId)?.style) ??
    null;
  const selectedImage = generatedImages.find((image) => image.id === selectedImageId) ?? null;

  useEffect(() => {
    async function loadAudiences() {
      setLoadingAudiences(true);
      const response = await fetch("/api/audiences");
      const body = (await response.json()) as { audiences: AudienceSegment[]; message?: string };
      setAudiences(body.audiences);
      setAudienceStatus(body.message ?? "");
      setLoadingAudiences(false);
    }

    loadAudiences().catch(() => {
      setAudienceStatus("Could not load audiences.");
      setLoadingAudiences(false);
    });
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    setProductQuery(query);

    if (!query.trim()) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }

    setLoadingProducts(true);

    try {
      const response = await fetch(`/api/products?brand=${encodeURIComponent(input.brandId)}&q=${encodeURIComponent(query)}`);
      const body = (await response.json()) as { products: ProductOption[] };
      setProducts(body.products);
    } finally {
      setLoadingProducts(false);
    }
  }, [input.brandId]);

  function selectBrand(brandId: BrandId) {
    const nextBrand = getCampaignBrand(brandId);

    setInput((current) => ({
      ...current,
      brandId,
      products: "",
      productIds: [],
      assets: [],
      assetNotes: "",
      includeLogo: true,
      audience: nextBrand.defaultAudience,
      audienceId: "",
      klaviyoAudienceId: ""
    }));
    setProductQuery("");
    setProducts([]);
    setStrategy(null);
    setGeneratedImages([]);
    setSelectedConceptId(null);
    setSelectedImageId(null);
    setDraft(null);
    setDriveExport(null);
  }

  function generateStrategy() {
    const nextStrategy = createMockStrategy(input);
    const nextFields = createMockKlaviyoFields(input);
    const nextInput = {
      ...input,
      subjectLine: input.subjectLine || nextFields.subjectLine,
      previewText: input.previewText || nextFields.previewText
    };
    setStrategy(nextStrategy);
    const nextImages = createMockImageSet(nextInput, nextStrategy, concepts);
    setInput(nextInput);
    setGeneratedImages(nextImages);
    setSelectedConceptId("cream-studio");
    setSelectedImageId(null);
    setDraft(null);
    setDriveExport(null);

    window.requestAnimationFrame(() => {
      packageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function generateKlaviyoFields() {
    const nextFields = createMockKlaviyoFields(input);
    setInput((current) => ({
      ...current,
      subjectLine: nextFields.subjectLine,
      previewText: nextFields.previewText
    }));
    setDraft(null);
    setDriveExport(null);
  }

  function scrollToStep(step: string) {
    const refs: Record<string, RefObject<HTMLElement | HTMLDivElement | null>> = {
      Brief: promptRef,
      "Klaviyo Fields": promptRef,
      Images: imagesRef,
      Review: draftRef,
      "Klaviyo Draft": draftRef
    };

    refs[step]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function createDraft() {
    if (!strategy || !selectedConcept || !selectedImage?.imageUrl) return;
    setDrafting(true);
    const response = await fetch("/api/klaviyo/draft", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        input,
        strategy,
        concept: selectedConcept,
        generatedImages: [selectedImage]
      })
    });
    const body = (await response.json()) as { draft: KlaviyoDraft };
    setDraft(body.draft);
    setDrafting(false);
  }

  async function exportToDrive(includeSocialKit: boolean) {
    if (!selectedImage?.imageUrl) return;

    setExportingDrive(true);
    const response = await fetch("/api/google-drive/export", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        input,
        selectedImage,
        includeSocialKit
      })
    });
    const body = (await response.json()) as { export?: DriveExport };

    if (body.export) {
      setDriveExport(body.export);
    }

    setExportingDrive(false);
  }

  async function generateImages() {
    if (!generatedImages.length) return;

    setGeneratingImages(true);
    setGeneratedImages((current) => current.map((image) => ({ ...image, status: "generating" })));

    const response = await fetch("/api/images/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        images: generatedImages
      })
    });
    const body = (await response.json()) as { images?: GeneratedImage[] };

    if (body.images?.length) {
      setGeneratedImages(body.images);
      setSelectedImageId(body.images.find((image) => image.imageUrl)?.id ?? null);
      setDriveExport(null);
    } else {
      setGeneratedImages((current) =>
        current.map((image) => ({ ...image, status: "failed", error: "Image generation did not return images." }))
      );
    }

    setGeneratingImages(false);
  }

  async function generateSimilarImages() {
    if (!selectedImage?.imageUrl) return;

    const sourceImage = selectedImage;
    const similarBriefs: GeneratedImage[] = similarVariants.map((variant) => ({
      ...sourceImage,
      id: `${sourceImage.id}-similar-${variant.toLowerCase()}-${Date.now()}`,
      version: variant === "A" ? "A" : "B",
      status: "brief-ready",
      imageUrl: undefined,
      error: undefined,
      prompt: [
        sourceImage.prompt,
        `Create variation ${variant} that stays close to the selected image style, composition, mood, and brand treatment.`,
        "Keep the same campaign objective and product relevance, but change enough details to give the marketer a fresh option."
      ].join(" ")
    }));

    setGeneratingImages(true);
    setGeneratedImages(similarBriefs);
    setSelectedImageId(null);
    setDraft(null);

    const response = await fetch("/api/images/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        images: similarBriefs
      })
    });
    const body = (await response.json()) as { images?: GeneratedImage[] };

    if (body.images?.length) {
      setGeneratedImages(body.images);
      setSelectedImageId(body.images.find((image) => image.imageUrl)?.id ?? null);
      setDriveExport(null);
    } else {
      setGeneratedImages((current) =>
        current.map((image) => ({ ...image, status: "failed", error: "Similar image generation did not return images." }))
      );
    }

    setGeneratingImages(false);
  }

  return (
    <main className="studio-shell" data-brand={selectedBrand.id}>
      <header className="topbar">
        <img src={selectedBrand.heroSrc} alt={selectedBrand.heroAlt} />
        <div className="hero-copy">
          <div className="brand-selector" aria-label="Brand selector">
            <label>
              Brand
              <select aria-label="Brand" value={input.brandId} onChange={(event) => selectBrand(event.target.value as BrandId)}>
                {Object.values(campaignBrands).map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="eyebrow">{selectedBrand.name}</p>
          <h1>Campaign Studio</h1>
          <p>{selectedBrand.promise}</p>
          <div className="hero-stats" aria-label="Workflow summary">
            <span>Audience</span>
            <span>Products</span>
            <span>Creative</span>
            <span>Draft</span>
          </div>
        </div>
      </header>

      <nav className="stepper" aria-label="MVP workflow">
        {steps.map((step, index) => (
          <button
            key={step}
            className={index <= (draft ? 4 : selectedConcept ? 3 : strategy ? 2 : 0) ? "active" : ""}
            type="button"
            onClick={() => scrollToStep(step)}
          >
            {step}
          </button>
        ))}
      </nav>

      <div className="workspace">
        <div ref={promptRef}>
          <PromptBox
            value={input}
            audiences={audiences}
            audienceStatus={audienceStatus}
            products={products}
            loadingAudiences={loadingAudiences}
            loadingProducts={loadingProducts}
            productQuery={productQuery}
            brand={selectedBrand}
            onChange={setInput}
            onGenerate={generateStrategy}
            onGenerateFields={generateKlaviyoFields}
            onProductSearch={searchProducts}
          />
        </div>

        <div className="right-column" ref={packageRef}>
          <div ref={imagesRef}>
            <ImageSetPanel
              images={generatedImages}
              selectedImageId={selectedImageId}
              includeLogo={input.includeLogo}
              generating={generatingImages}
              brand={selectedBrand}
              onSelectImage={(image) => {
                setSelectedImageId(image.id);
                setSelectedConceptId(concepts.find((concept) => concept.name === image.style)?.id ?? null);
                setDraft(null);
                setDriveExport(null);
              }}
              onGenerateImages={generateImages}
              onGenerateSimilar={generateSimilarImages}
            />
          </div>

          <SocialKitPanel
            selectedImage={selectedImage}
            driveExport={driveExport}
            exporting={exportingDrive}
            onBackupSelected={() => exportToDrive(false)}
            onCreateSocialKit={() => exportToDrive(true)}
          />

          <div ref={draftRef}>
            <ApprovalPanel
              input={input}
              strategy={strategy}
              selectedConcept={selectedConcept}
              selectedImage={selectedImage}
              draft={draft}
              drafting={drafting}
              onCreateDraft={createDraft}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
