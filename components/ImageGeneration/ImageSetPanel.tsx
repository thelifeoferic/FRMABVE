"use client";

import { useEffect, useMemo, useState } from "react";
import type { GeneratedImage } from "@/lib/types/campaign";

type ImageSetPanelProps = {
  images: GeneratedImage[];
  selectedImageId: string | null;
  includeLogo: boolean;
  generating: boolean;
  onSelectImage: (image: GeneratedImage) => void;
  onGenerateImages: (style: GeneratedImage["style"]) => void;
  onGenerateSimilar: () => void;
};

const generationLanes: Array<{ id: GeneratedImage["style"]; label: string; detail: string }> = [
  { id: "Product", label: "Product", detail: "Packaging, offer, and conversion clarity" },
  { id: "Wellness", label: "Wellness", detail: "Benefits, rituals, and plant-led calm" },
  { id: "Lifestyle", label: "Lifestyle", detail: "Human occasion, mood, and discovery" }
];

export function ImageSetPanel({
  images,
  selectedImageId,
  includeLogo,
  generating,
  onSelectImage,
  onGenerateImages,
  onGenerateSimilar
}: ImageSetPanelProps) {
  const [expandedImage, setExpandedImage] = useState<GeneratedImage | null>(null);
  const [selectedLane, setSelectedLane] = useState<GeneratedImage["style"]>("Product");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const generatedImages = images.filter((image) => image.imageUrl);
  const failedImages = images.filter((image) => image.status === "failed");
  const firstFailure = failedImages.find((image) => image.error)?.error;
  const canGenerateSimilar = generatedImages.some((image) => image.id === selectedImageId);
  const availableLanes = useMemo(() => new Set(images.map((image) => image.style)), [images]);

  useEffect(() => {
    if (!generating) {
      setElapsedSeconds(0);
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [generating]);

  return (
    <section className="panel image-set-panel" aria-label="Generated image set">
      <div className="section-heading">
        <p>Choose Campaign Image</p>
        <span>{generatedImages.length ? "Select one or regenerate" : images.length ? "Ready to generate" : "Waiting for package"}</span>
      </div>

      {images.length ? (
        <div className="image-lane-picker" aria-label="Image generation lane">
          <div>
            <strong>Image direction</strong>
            <span>{includeLogo ? "Logo-aware layout requested" : "Logo excluded from image prompt"}</span>
          </div>
          <div className="image-lane-options">
            {generationLanes.map((lane) => (
              <button
                className={selectedLane === lane.id ? "image-lane-option active" : "image-lane-option"}
                disabled={generating || !availableLanes.has(lane.id)}
                key={lane.id}
                type="button"
                onClick={() => setSelectedLane(lane.id)}
              >
                <strong>{lane.label}</strong>
                <span>{lane.detail}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {generating ? (
        <div className="image-generation-progress" role="status" aria-live="polite">
          <span className="generation-spinner" aria-hidden="true" />
          <div>
            <strong>Creating 3 {selectedLane.toLowerCase()} images</strong>
            <span>OpenAI is rendering. This can take a minute or two. {elapsedSeconds}s elapsed.</span>
          </div>
        </div>
      ) : null}

      {generatedImages.length ? (
        <div className="image-set-grid">
          {generatedImages.map((image) => (
            <article
              className={image.id === selectedImageId ? "image-brief-card selected" : "image-brief-card"}
              key={image.id}
            >
              <span className="image-preview-frame">
                <img src={image.imageUrl ?? ""} alt={image.altText} />
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
          <button className="primary-button image-generate-button" type="button" disabled={generating} onClick={() => onGenerateImages(selectedLane)}>
            {generating
              ? `Generating 3 ${selectedLane} Images...`
              : generatedImages.length
                ? `Regenerate 3 ${selectedLane} Images`
                : `Generate 3 ${selectedLane} Images`}
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
