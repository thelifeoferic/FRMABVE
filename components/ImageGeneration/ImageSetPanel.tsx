"use client";

import { useState } from "react";
import type { CampaignBrand } from "@/lib/brand/default-brand";
import type { GeneratedImage } from "@/lib/types/campaign";

type ImageSetPanelProps = {
  images: GeneratedImage[];
  selectedImageId: string | null;
  includeLogo: boolean;
  generating: boolean;
  brand: CampaignBrand;
  onSelectImage: (image: GeneratedImage) => void;
  onGenerateImages: () => void;
  onGenerateSimilar: () => void;
};

export function ImageSetPanel({
  images,
  selectedImageId,
  includeLogo,
  generating,
  brand,
  onSelectImage,
  onGenerateImages,
  onGenerateSimilar
}: ImageSetPanelProps) {
  const [expandedImage, setExpandedImage] = useState<GeneratedImage | null>(null);
  const generatedImages = images.filter((image) => image.imageUrl);
  const failedImages = images.filter((image) => image.status === "failed");
  const firstFailure = failedImages.find((image) => image.error)?.error;
  const canGenerateSimilar = generatedImages.some((image) => image.id === selectedImageId);

  return (
    <section className="panel image-set-panel" aria-label="Generated image set">
      <div className="section-heading">
        <p>Choose Campaign Image</p>
        <span>{generatedImages.length ? "Select one or regenerate" : images.length ? "Ready to generate" : "Waiting for package"}</span>
      </div>

      {generatedImages.length ? (
        <div className="image-set-grid">
          {generatedImages.map((image) => (
            <article
              className={image.id === selectedImageId ? "image-brief-card selected" : "image-brief-card"}
              key={image.id}
            >
              <span className="image-preview-frame">
                <img src={image.imageUrl ?? ""} alt={image.altText} />
                {includeLogo ? <img className="image-logo-mark" src={brand.logoSrc} alt="" /> : null}
                <button className="selected-image-badge" type="button" onClick={() => onSelectImage(image)}>
                  {image.id === selectedImageId ? "Selected" : "Select"}
                </button>
                <button
                  className="image-view-button"
                  type="button"
                  aria-label="View image larger"
                  onClick={() => setExpandedImage(image)}
                >
                  View
                </button>
              </span>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-panel embedded-empty">
          <p>{images.length ? "Image briefs are ready." : "Generate the campaign package first."}</p>
          <span>
            {images.length
              ? "Generate three draft image options first. Create more only after a direction is worth exploring."
              : "No image thumbnails will appear here until image generation returns results."}
          </span>
          {failedImages.length ? (
            <small>{firstFailure ?? `${failedImages.length} image request failed. Regenerate when ready.`}</small>
          ) : null}
        </div>
      )}

      {images.length ? (
        <div className="image-actions">
          <button className="primary-button image-generate-button" type="button" disabled={generating} onClick={onGenerateImages}>
            {generating ? "Generating 3 Draft Images..." : generatedImages.length ? "Regenerate 3 Draft Images" : "Generate 3 Draft Images"}
          </button>
          {generatedImages.length ? (
            <button className="ghost-button image-generate-button" type="button" disabled={generating || !canGenerateSimilar} onClick={onGenerateSimilar}>
              Generate 3 More Like Selected
            </button>
          ) : null}
        </div>
      ) : null}

      {expandedImage?.imageUrl ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Generated image preview">
          <button className="image-lightbox-close" type="button" aria-label="Close image preview" onClick={() => setExpandedImage(null)}>
            X
          </button>
          <img src={expandedImage.imageUrl} alt={expandedImage.altText} />
        </div>
      ) : null}
    </section>
  );
}
