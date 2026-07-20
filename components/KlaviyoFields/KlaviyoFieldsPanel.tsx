"use client";

import type { CampaignBrand } from "@/lib/brand/default-brand";
import type { CampaignInput } from "@/lib/types/campaign";

type KlaviyoFieldsPanelProps = {
  value: CampaignInput;
  brand: CampaignBrand;
  onChange: (next: CampaignInput) => void;
  onGenerateFields: () => void;
};

export function KlaviyoFieldsPanel({ value, brand, onChange, onGenerateFields }: KlaviyoFieldsPanelProps) {
  function update(field: keyof CampaignInput, nextValue: string) {
    onChange({ ...value, [field]: nextValue });
  }

  return (
    <section className="panel klaviyo-review-panel" aria-label="Klaviyo fields">
      <div className="section-heading">
        <div>
          <p>Klaviyo Fields</p>
          <span>AI-filled draft fields for final review</span>
        </div>
        <button className="ghost-button" type="button" onClick={onGenerateFields}>
          AI generate
        </button>
      </div>

      <div className="klaviyo-field-grid">
        <label>
          Campaign name
          <input
            value={value.campaignName}
            onChange={(event) => update("campaignName", event.target.value)}
            placeholder={brand.sample.campaignName}
          />
        </label>
        <label>
          CTA
          <input value={value.cta} onChange={(event) => update("cta", event.target.value)} placeholder={brand.sample.cta} />
        </label>
      </div>

      <div className="klaviyo-field-grid">
        <label>
          From name
          <input
            value={value.fromName}
            onChange={(event) => update("fromName", event.target.value)}
            placeholder={brand.sample.fromName}
          />
        </label>
        <label>
          From email
          <input
            value={value.fromEmail}
            onChange={(event) => update("fromEmail", event.target.value)}
            placeholder={brand.sample.fromEmail}
            readOnly={brand.id === "asheville-dispensary"}
          />
        </label>
      </div>

      <label>
        Reply-to email
        <input
          value={value.replyToEmail}
          onChange={(event) => update("replyToEmail", event.target.value)}
          placeholder={brand.sample.replyToEmail}
          readOnly={brand.id === "asheville-dispensary"}
        />
      </label>

      <label>
        Subject line
        <input
          value={value.subjectLine}
          onChange={(event) => update("subjectLine", event.target.value)}
          placeholder="Example: Buy 2 Get 1 on SOHI Social Gummies"
        />
      </label>

      <label>
        Preview text
        <input
          value={value.previewText}
          onChange={(event) => update("previewText", event.target.value)}
          placeholder="Example: A relaxed edible campaign for weekend discovery."
        />
      </label>
    </section>
  );
}
