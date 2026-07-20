"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApprovalPanel } from "@/components/ApprovalPanel/ApprovalPanel";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { ImageEditStudio } from "@/components/ImageEditor/ImageEditStudio";
import { ImageSetPanel } from "@/components/ImageGeneration/ImageSetPanel";
import { KlaviyoFieldsPanel } from "@/components/KlaviyoFields/KlaviyoFieldsPanel";
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
  fromName: "Asheville Dispensary",
  fromEmail: "no-reply@avldispensary.com",
  replyToEmail: "support@avldispensary.com",
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

const steps = ["Brief", "Klaviyo Fields", "Images", "Edit", "Review", "Klaviyo Draft"];
const economyImageCount = 3;
const similarVariants: GeneratedImage["version"][] = ["A", "B", "C"];
type EditOutput = "square" | "story" | "wide";

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
  const [editingImage, setEditingImage] = useState(false);
  const [imageEditError, setImageEditError] = useState("");
  const promptRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);

  const selectedConcept =
    concepts.find((concept) => concept.id === selectedConceptId) ??
    concepts.find((concept) => concept.name === generatedImages.find((image) => image.id === selectedImageId)?.style) ??
    null;
  const selectedImage = generatedImages.find((image) => image.id === selectedImageId) ?? null;
  const activeStepIndex = draft ? 5 : selectedImage ? 3 : strategy ? 1 : 0;

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
      fromName: nextBrand.sample.fromName,
      fromEmail: nextBrand.sample.fromEmail,
      replyToEmail: nextBrand.sample.replyToEmail,
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
    setImageEditError("");
    setDraft(null);
    setDriveExport(null);
  }

  function generateStrategy() {
    const nextStrategy = createMockStrategy(input);
    const nextFields = createMockKlaviyoFields(input);
    const nextInput = {
      ...input,
      campaignName: input.campaignName || nextFields.campaignName,
      fromName: input.fromName || selectedBrand.sample.fromName,
      fromEmail: input.fromEmail || selectedBrand.sample.fromEmail,
      replyToEmail: input.replyToEmail || selectedBrand.sample.replyToEmail,
      subjectLine: input.subjectLine || nextFields.subjectLine,
      previewText: input.previewText || nextFields.previewText,
      cta: input.cta || nextFields.cta
    };
    setStrategy(nextStrategy);
    const nextImages = createMockImageSet(nextInput, nextStrategy, concepts);
    setInput(nextInput);
    setGeneratedImages(nextImages);
    setSelectedConceptId("cream-studio");
    setSelectedImageId(null);
    setImageEditError("");
    setDraft(null);
    setDriveExport(null);

    window.requestAnimationFrame(() => {
      fieldsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function generateKlaviyoFields() {
    const nextFields = createMockKlaviyoFields(input);
    setInput((current) => ({
      ...current,
      campaignName: nextFields.campaignName,
      subjectLine: nextFields.subjectLine,
      previewText: nextFields.previewText,
      cta: nextFields.cta
    }));
    setDraft(null);
    setDriveExport(null);
  }

  function scrollToStep(step: string) {
    const refs: Record<string, RefObject<HTMLElement | HTMLDivElement | null>> = {
      Brief: promptRef,
      "Klaviyo Fields": fieldsRef,
      Images: imagesRef,
      Edit: editRef,
      Review: draftRef,
      "Klaviyo Draft": draftRef
    };

    refs[step]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function createDraft() {
    if (!strategy || !selectedConcept) return;
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
        generatedImages: selectedImage ? [selectedImage] : []
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

    const imagesToGenerate = generatedImages.slice(0, economyImageCount);

    setGeneratingImages(true);
    setGeneratedImages(imagesToGenerate.map((image) => ({ ...image, status: "generating" })));

    try {
      const response = await fetch("/api/images/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          images: imagesToGenerate
        })
      });
      const body = (await response.json().catch(() => ({}))) as { images?: GeneratedImage[]; error?: string };

      if (!response.ok) {
        throw new Error(body.error ?? `Image generation returned HTTP ${response.status}.`);
      }

      if (body.images?.length) {
        setGeneratedImages(body.images);
        setSelectedImageId(body.images.find((image) => image.imageUrl)?.id ?? null);
        setImageEditError("");
        setDriveExport(null);
      } else {
        setGeneratedImages((current) =>
          current.map((image) => ({ ...image, status: "failed", error: "Image generation did not return images." }))
        );
      }
    } catch (error) {
      setGeneratedImages((current) =>
        current.map((image) => ({
          ...image,
          status: "failed",
          error: error instanceof Error ? error.message : "Image generation request failed."
        }))
      );
    } finally {
      setGeneratingImages(false);
    }
  }

  async function generateSimilarImages() {
    if (!selectedImage?.imageUrl) return;

    const sourceImage = selectedImage;
    const similarBriefs: GeneratedImage[] = similarVariants.map((variant) => ({
      ...sourceImage,
      id: `${sourceImage.id}-similar-${variant.toLowerCase()}-${Date.now()}`,
      version: variant,
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

    try {
      const response = await fetch("/api/images/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          images: similarBriefs
        })
      });
      const body = (await response.json().catch(() => ({}))) as { images?: GeneratedImage[]; error?: string };

      if (!response.ok) {
        throw new Error(body.error ?? `Similar image generation returned HTTP ${response.status}.`);
      }

      if (body.images?.length) {
        setGeneratedImages(body.images);
        setSelectedImageId(body.images.find((image) => image.imageUrl)?.id ?? null);
        setImageEditError("");
        setDriveExport(null);
      } else {
        setGeneratedImages((current) =>
          current.map((image) => ({ ...image, status: "failed", error: "Similar image generation did not return images." }))
        );
      }
    } catch (error) {
      setGeneratedImages((current) =>
        current.map((image) => ({
          ...image,
          status: "failed",
          error: error instanceof Error ? error.message : "Similar image generation request failed."
        }))
      );
    } finally {
      setGeneratingImages(false);
    }
  }

  async function editSelectedImage(editPrompt: string, output: EditOutput) {
    if (!selectedImage?.imageUrl) return;

    setEditingImage(true);
    setImageEditError("");

    try {
      const response = await fetch("/api/images/edit", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          image: selectedImage,
          editPrompt,
          output
        })
      });
      const body = (await response.json().catch(() => ({}))) as { image?: GeneratedImage; error?: string };

      if (!response.ok || !body.image) {
        throw new Error(body.error ?? `Image edit returned HTTP ${response.status}.`);
      }

      setGeneratedImages((current) => [body.image as GeneratedImage, ...current.filter((image) => image.id !== body.image?.id)]);
      setSelectedImageId(body.image.id);
      setSelectedConceptId(concepts.find((concept) => concept.name === body.image?.style)?.id ?? null);
      setDraft(null);
      setDriveExport(null);

      window.requestAnimationFrame(() => {
        editRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (error) {
      setImageEditError(error instanceof Error ? error.message : "Image edit request failed.");
    } finally {
      setEditingImage(false);
    }
  }

  return (
    <main className="studio-shell" data-brand={selectedBrand.id}>
      <AppHeader active="studio" brandId={selectedBrand.id} brandName={selectedBrand.name} />

      <header className="topbar">
        <img src={selectedBrand.heroSrc} alt={selectedBrand.heroAlt} />
        <img className="hero-brand-logo" src={selectedBrand.logoSrc} alt={`${selectedBrand.name} logo`} />
        <div className="hero-copy">
          <div className="brand-selector" aria-label="Brand selector">
            <label>
              <span className="sr-only">Choose brand</span>
              <select aria-label="Brand" value={input.brandId} onChange={(event) => selectBrand(event.target.value as BrandId)}>
                {Object.values(campaignBrands).map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <h1>Campaign Studio</h1>
          <p>{selectedBrand.promise}</p>
        </div>
      </header>

      <nav className="stepper" aria-label="MVP workflow">
        {steps.map((step, index) => (
          <button
            key={step}
            className={index <= activeStepIndex ? "active" : ""}
            type="button"
            onClick={() => scrollToStep(step)}
          >
            {step}
          </button>
        ))}
        <a className="stepper-link" href={`/settings?brand=${selectedBrand.id === "asheville-dispensary" ? "asheville" : "plant-bar"}`}>
          Brand Kit
        </a>
        <a className="stepper-link" href={`/prompts?brand=${selectedBrand.id === "asheville-dispensary" ? "asheville" : "plant-bar"}`}>
          AI Prompts
        </a>
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
            onProductSearch={searchProducts}
          />
        </div>

        <div className="right-column">
          <div ref={fieldsRef}>
            {strategy ? (
              <KlaviyoFieldsPanel
                value={input}
                brand={selectedBrand}
                onChange={setInput}
                onGenerateFields={generateKlaviyoFields}
              />
            ) : (
              <section className="panel klaviyo-review-panel klaviyo-review-empty" aria-label="Klaviyo fields">
                <div className="section-heading">
                  <p>Klaviyo Fields</p>
                  <span>Waiting for package</span>
                </div>
                <strong>Generate the campaign package first.</strong>
                <p>Subject, preview, CTA, campaign name, and sender fields will appear here for review.</p>
              </section>
            )}
          </div>

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
                setImageEditError("");
                setDraft(null);
                setDriveExport(null);
              }}
              onGenerateImages={generateImages}
              onGenerateSimilar={generateSimilarImages}
            />
          </div>

          <div ref={editRef}>
            <ImageEditStudio
              selectedImage={selectedImage}
              brand={selectedBrand}
              editing={editingImage}
              error={imageEditError}
              onEditImage={editSelectedImage}
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
