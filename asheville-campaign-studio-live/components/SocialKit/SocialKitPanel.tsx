"use client";

import type { DriveExport, GeneratedImage } from "@/lib/types/campaign";

type SocialKitPanelProps = {
  selectedImage: GeneratedImage | null;
  driveExport: DriveExport | null;
  exporting: boolean;
  onBackupSelected: () => void;
  onCreateSocialKit: () => void;
};

export function SocialKitPanel({
  selectedImage,
  driveExport,
  exporting,
  onBackupSelected,
  onCreateSocialKit
}: SocialKitPanelProps) {
  const ready = Boolean(selectedImage?.imageUrl);

  return (
    <section className="panel social-kit-panel" aria-label="Google Drive social kit">
      <div className="section-heading">
        <p>Drive Backup & Social Kit</p>
        <span>{ready ? "Selected image ready" : "Choose an image first"}</span>
      </div>

      <div className="social-kit-layout">
        <div className="social-kit-copy">
          <strong>Keep the approved creative backed up.</strong>
          <p>
            Save the selected campaign image as the source asset, then prepare matching Story and Feed versions for the same campaign.
          </p>
        </div>

        <div className="social-kit-actions">
          <button className="ghost-button" type="button" disabled={!ready || exporting} onClick={onBackupSelected}>
            {exporting ? "Preparing Drive..." : "Backup Selected Image"}
          </button>
          <button className="primary-button" type="button" disabled={!ready || exporting} onClick={onCreateSocialKit}>
            {exporting ? "Preparing Social Kit..." : "Create Social Kit + Drive Backup"}
          </button>
        </div>
      </div>

      <div className="social-kit-formats" aria-label="Social kit formats">
        <span>Source image</span>
        <span>Story 1080 x 1920</span>
        <span>Feed 1080 x 1080</span>
      </div>

      {driveExport ? (
        <div className="draft-ready drive-ready" role="status">
          <span>{driveExport.status === "uploaded" ? "Uploaded to Google Drive" : "Drive export staged"}</span>
          <strong>{driveExport.folderName}</strong>
          <p>{driveExport.note}</p>
          <small>{driveExport.assets.map((asset) => `${asset.name} (${asset.dimensions})`).join(" / ")}</small>
        </div>
      ) : null}
    </section>
  );
}
