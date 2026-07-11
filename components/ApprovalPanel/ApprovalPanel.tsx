import type { CampaignInput, CampaignStrategy, GeneratedImage, KlaviyoDraft, VisualConcept } from "@/lib/types/campaign";

type ApprovalPanelProps = {
  input: CampaignInput;
  strategy: CampaignStrategy | null;
  selectedConcept: VisualConcept | null;
  selectedImage: GeneratedImage | null;
  draft: KlaviyoDraft | null;
  drafting: boolean;
  onCreateDraft: () => void;
};

export function ApprovalPanel({ input, strategy, selectedConcept, selectedImage, draft, drafting, onCreateDraft }: ApprovalPanelProps) {
  const hasAudience = Boolean(input.klaviyoAudienceId || input.audienceId);
  const ready = Boolean(strategy && selectedConcept && hasAudience && input.subjectLine && input.previewText && input.fromName && input.fromEmail);

  return (
    <section className="panel approval-panel" aria-label="Approval">
      <div className="section-heading">
        <p>Klaviyo Draft Review</p>
        <span>{selectedImage ? `${selectedImage.style} ${selectedImage.version} selected` : "Image optional"}</span>
      </div>

      <div className="approval-preview">
        <span>{input.campaignName || "Untitled Campaign"}</span>
        <strong>{input.subjectLine || "Subject line pending"}</strong>
        <p>{input.previewText || "Generate Klaviyo fields and choose one image."}</p>
        <small>
          From: {input.fromName || "Missing"} {input.fromEmail ? `<${input.fromEmail}>` : ""}
        </small>
        <small>Audience: {input.klaviyoAudienceId || input.audienceId || "Missing"}</small>
        <em>{strategy?.cta ?? input.cta ?? "CTA"}</em>
      </div>

      <button className="primary-button" disabled={!ready || drafting} onClick={onCreateDraft}>
        {drafting ? "Creating Draft..." : "Create Klaviyo Draft"}
      </button>

      {draft ? (
        <div className={draft.status === "klaviyo-draft" ? "draft-ready" : "draft-ready draft-warning"} role="status">
          <span>
            {draft.status === "klaviyo-draft"
              ? "Created as Klaviyo draft"
              : "Not created in Klaviyo"}
          </span>
          <strong>{draft.id}</strong>
          {draft.klaviyoCampaignId ? <small>Klaviyo campaign ID: {draft.klaviyoCampaignId}</small> : null}
          <p>{draft.subjectLine}</p>
          {draft.integrationMessage ? <p>{draft.integrationMessage}</p> : null}
          <small>
            Audience: {draft.audienceName || "Not selected"} / Products:{" "}
            {draft.productNames.length ? draft.productNames.join(", ") : "Not selected"}
          </small>
          <small>
            Assets: {draft.assetCount} / Images: {draft.imageCount} / Image generation: {draft.imageGenerationOwner}
          </small>
        </div>
      ) : null}
    </section>
  );
}
