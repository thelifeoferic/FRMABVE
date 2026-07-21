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
  const destination = driveExport
    ? `Google Drive / FRM ABVE Campaign Exports / ${driveExport.folderName}`
    : "Google Drive / FRM ABVE Campaign Exports / campaign folder";
  const outputFormats = driveExport?.assets.map((asset) => asset.format) ?? [];

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
            Save the selected campaign image to Google Drive, then prepare matching Instagram Story and Instagram Post versions.
          </p>
          <small>Destination: {destination}</small>
        </div>

        <div className="social-kit-actions">
          <button className="ghost-button drive-download-button" type="button" disabled={!ready || exporting} onClick={onBackupSelected}>
            {exporting ? "Preparing Drive..." : "Google Drive"}
          </button>
          <button className="primary-button" type="button" disabled={!ready || exporting} onClick={onCreateSocialKit}>
            {exporting ? "Preparing Social Kit..." : "Create Social Kit + Drive Backup"}
          </button>
        </div>
      </div>

      <div className="social-kit-formats" aria-label="Social kit outputs">
        <span className={outputFormats.includes("selected-image") ? "ready" : ""}>Selected image</span>
        <span className={outputFormats.includes("instagram-story") ? "ready" : ""}>Instagram Story</span>
        <span className={outputFormats.includes("instagram-feed") ? "ready" : ""}>Instagram Post</span>
      </div>

      {driveExport ? (
        <div className="draft-ready drive-ready" role="status">
          <span>{driveExport.status === "uploaded" ? "Uploaded to Google Drive" : "Drive export staged"}</span>
          <strong>{driveExport.folderName}</strong>
          <p>Destination: {destination}</p>
          <p>{driveExport.note}</p>
          {driveExport.folderUrl ? (
            <a href={driveExport.folderUrl} target="_blank" rel="noreferrer">
              Open Drive folder
            </a>
          ) : null}
          <small>{driveExport.assets.map((asset) => `${asset.name} (${asset.dimensions})`).join(" / ")}</small>
        </div>
      ) : null}
    </section>
  );
}
