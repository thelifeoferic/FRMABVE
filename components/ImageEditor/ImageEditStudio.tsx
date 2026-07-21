"use client";

import { useState } from "react";
import type { CampaignBrand } from "@/lib/brand/default-brand";
import type { GeneratedImage } from "@/lib/types/campaign";

type EditOutput = "square" | "story" | "wide";

type ImageEditStudioProps = {
  selectedImage: GeneratedImage | null;
  brand: CampaignBrand;
  editing: boolean;
  error: string;
  onEditImage: (editPrompt: string, output: EditOutput) => void;
};

const editOutputOptions: Array<{ id: EditOutput; label: string; detail: string }> = [
  { id: "square", label: "Campaign square", detail: "1:1 draft image" },
  { id: "story", label: "Instagram story", detail: "vertical 9:16" },
  { id: "wide", label: "Wide banner", detail: "landscape draft" }
];

export function ImageEditStudio({ selectedImage, brand, editing, error, onEditImage }: ImageEditStudioProps) {
  const [editPrompt, setEditPrompt] = useState("");
  const [output, setOutput] = useState<EditOutput>("square");
  const canEdit = Boolean(selectedImage?.imageUrl && editPrompt.trim()) && !editing;

  return (
    <section className="panel image-edit-studio" aria-label="Image edit studio">
      <div className="section-heading">
        <p>Image Edit Studio</p>
        <span>{selectedImage?.imageUrl ? "Selected image ready" : "Choose an image first"}</span>
      </div>

      {selectedImage?.imageUrl ? (
        <div className="image-edit-layout">
          <div className="image-edit-preview" aria-label="Selected image preview">
            <img src={selectedImage.imageUrl} alt={selectedImage.altText} />
          </div>

          <div className="image-edit-controls">
            <label>
              <span>Edit request</span>
              <textarea
                value={editPrompt}
                onChange={(event) => setEditPrompt(event.target.value)}
                placeholder={`Example: tighten the crop, add more ${brand.name} negative space, keep packaging and logo accurate.`}
              />
            </label>

            <div className="edit-output-options" aria-label="Edit output format">
              {editOutputOptions.map((option) => (
                <button
                  className={option.id === output ? "edit-output-option active" : "edit-output-option"}
                  key={option.id}
                  type="button"
                  onClick={() => setOutput(option.id)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.detail}</span>
                </button>
              ))}
            </div>

            {error ? <p className="image-edit-error">{error}</p> : null}

            <button className="primary-button image-edit-submit" type="button" disabled={!canEdit} onClick={() => onEditImage(editPrompt, output)}>
              {editing ? "Editing Image..." : "Create Edited Variant"}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-panel embedded-empty">
          <p>Select a generated image to edit.</p>
          <span>The editor will create a new variant and keep the original image available for comparison.</span>
        </div>
      )}
    </section>
  );
}
