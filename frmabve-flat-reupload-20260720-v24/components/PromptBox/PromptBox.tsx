"use client";

import { useEffect, useState } from "react";
import type { CampaignBrand } from "@/lib/brand/default-brand";
import type { AudienceSegment, CampaignAsset, CampaignInput, ProductOption } from "@/lib/types/campaign";

type PromptBoxProps = {
  value: CampaignInput;
  audiences: AudienceSegment[];
  audienceStatus: string;
  products: ProductOption[];
  loadingAudiences: boolean;
  loadingProducts: boolean;
  productQuery: string;
  brand: CampaignBrand;
  onChange: (next: CampaignInput) => void;
  onGenerate: () => void;
  onProductSearch: (query: string) => void;
};

function createSample(brand: CampaignBrand): CampaignInput {
  return {
  brandId: brand.id,
  campaignName: brand.sample.campaignName,
  fromName: brand.sample.fromName,
  fromEmail: brand.sample.fromEmail,
  replyToEmail: brand.sample.replyToEmail,
  subjectLine: brand.sample.subjectLine,
  previewText: brand.sample.previewText,
  products: brand.sample.products,
  productIds: [],
  assets: [],
  assetNotes: brand.sample.assetNotes,
  includeLogo: true,
  offer: brand.sample.offer,
  audience: brand.defaultAudience,
  audienceId: "",
  klaviyoAudienceId: "",
  tone: brand.sample.tone,
  objective: brand.sample.objective,
  cta: brand.sample.cta,
  notes: brand.sample.notes
  };
}

function readAssetFile(file: File): Promise<CampaignAsset> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        role: "reference",
        fileType: file.type || "unknown",
        size: file.size,
        analysisStatus: "ready",
        summary: `${file.name} attached as a non-image reference file.`
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        role: "reference",
        fileType: file.type || "unknown",
        size: file.size,
        dataUrl: typeof reader.result === "string" ? reader.result : undefined,
        analysisStatus: "pending"
      });
    };

    reader.onerror = () => {
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        role: "reference",
        fileType: file.type || "unknown",
        size: file.size,
        analysisStatus: "failed",
        summary: "This image could not be read locally, but its filename remains available as reference context."
      });
    };

    reader.readAsDataURL(file);
  });
}

export function PromptBox({
  value,
  audiences,
  audienceStatus,
  products,
  loadingAudiences,
  loadingProducts,
  productQuery,
  brand,
  onChange,
  onGenerate,
  onProductSearch
}: PromptBoxProps) {
  const assets = value.assets ?? [];
  const productIds = value.productIds ?? [];
  const [localProductQuery, setLocalProductQuery] = useState(productQuery);
  const hasProductQuery = localProductQuery.trim().length > 0;
  const visibleProducts = hasProductQuery ? products.slice(0, 8) : [];
  const usesAlpineAudience = brand.id === "asheville-dispensary";
  const productStatus = loadingProducts
    ? "Searching"
    : hasProductQuery
      ? products.length
        ? `${visibleProducts.length} of ${products.length} results`
        : "No matches"
      : "Type to search";

  useEffect(() => {
    const normalizedLocal = localProductQuery.trim();
    const normalizedSynced = productQuery.trim();

    if (normalizedLocal === normalizedSynced) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onProductSearch(normalizedLocal);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [localProductQuery, onProductSearch, productQuery]);

  function update(field: keyof CampaignInput, nextValue: string | boolean | string[] | CampaignAsset[]) {
    onChange({ ...value, [field]: nextValue });
  }

  function selectAudience(audienceId: string) {
    const audience = audiences.find((item) => item.id === audienceId);
    onChange({
      ...value,
      audienceId,
      audience: audience?.name ?? value.audience
    });
  }

  function toggleProduct(product: ProductOption) {
    const selected = productIds.includes(product.id)
      ? productIds.filter((id) => id !== product.id)
      : [...productIds, product.id];
    const selectedNames = products.filter((item) => selected.includes(item.id)).map((item) => item.name);

    onChange({
      ...value,
      productIds: selected,
      products: selectedNames.join(", ")
    });
  }

  async function addAssets(files: FileList | null) {
    if (!files) return;

    const pendingAssets = await Promise.all(Array.from(files).map(readAssetFile));
    const readyAssets = pendingAssets.map((asset) => ({
      ...asset,
      analysisStatus: "ready" as const,
      summary:
        asset.summary ??
        `${asset.name} is attached as a reference. Use its visible packaging, colors, product cues, and composition direction.`
    }));

    update("assets", [...assets, ...readyAssets]);
  }

  function updateAssetRole(assetId: string, role: CampaignAsset["role"]) {
    update(
      "assets",
      assets.map((asset) => (asset.id === assetId ? { ...asset, role } : asset))
    );
  }

  function removeAsset(assetId: string) {
    update(
      "assets",
      assets.filter((asset) => asset.id !== assetId)
    );
  }

  function formatBytes(size: number) {
    if (size < 1024 * 1024) {
      return `${Math.max(1, Math.round(size / 1024)).toLocaleString()} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <section className="panel prompt-panel" aria-label="Campaign prompt">
      <div className="section-heading">
        <p>Campaign Brief</p>
        <button
          className="ghost-button"
          onClick={() => {
            setLocalProductQuery("");
            onProductSearch("");
            onChange(createSample(brand));
          }}
        >
          Use sample
        </button>
      </div>

      <label className="brief-field">
        Notes, prompt, or campaign ask
        <textarea
          value={value.notes}
          onChange={(event) => update("notes", event.target.value)}
          rows={7}
          placeholder="Example: Create a premium weekend campaign for edible shoppers. Push gummies and seltzers, keep it relaxed and modern, include a soft offer, and make it ready for Klaviyo review."
        />
      </label>

      <label className="offer-field">
        Offer
        <input value={value.offer} onChange={(event) => update("offer", event.target.value)} placeholder="Example: 10% off this spring" />
      </label>

      {usesAlpineAudience ? (
        <div className="integration-grid">
          <label>
            Alpine IQ Audience
            <select value={value.audienceId} onChange={(event) => selectAudience(event.target.value)}>
              <option value="">
                {loadingAudiences
                  ? "Loading audiences..."
                  : audiences.length
                    ? "Select audience"
                    : "No Alpine IQ audiences loaded"}
              </option>
              {audiences.map((audience) => (
                <option key={audience.id} value={audience.id}>
                  {audience.name}
                  {audience.memberCount ? ` (${audience.memberCount.toLocaleString()})` : ""}
                </option>
              ))}
            </select>
          </label>
          {audienceStatus ? <div className="audience-status">{audienceStatus}</div> : null}
        </div>
      ) : (
        <div className="import-card brand-audience-card">
          <strong>Klaviyo only</strong>
        </div>
      )}

      <label>
        {usesAlpineAudience ? "Klaviyo draft audience ID" : "Klaviyo audience ID"}
        <input
          value={value.klaviyoAudienceId}
          onChange={(event) => update("klaviyoAudienceId", event.target.value)}
          placeholder="Example: 278616"
        />
      </label>

      <div className="product-picker" aria-label={brand.productSearchLabel}>
        <div className="section-heading compact-heading">
          <p>Product Search</p>
          <span>{productStatus}</span>
        </div>
        <form
          className="product-search"
          onSubmit={(event) => {
            event.preventDefault();
            onProductSearch(localProductQuery.trim());
          }}
        >
          <input
            value={localProductQuery}
            onChange={(event) => setLocalProductQuery(event.target.value)}
            placeholder={brand.productSearchPlaceholder}
          />
          <button className="ghost-button" type="submit">
            Search
          </button>
        </form>
        {value.products ? (
          <div className="selected-products">
            <span>Selected</span>
            <strong>{value.products}</strong>
          </div>
        ) : null}
        {hasProductQuery ? (
          <div className="product-options">
            {visibleProducts.map((product) => (
              <button
                key={product.id}
                className={productIds.includes(product.id) ? "product-chip selected" : "product-chip"}
                type="button"
                onClick={() => toggleProduct(product)}
              >
                <strong>{product.name}</strong>
                <span>
                  {product.category ?? "Website"}
                  {product.price ? ` / ${product.price}` : ""}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="asset-uploader" aria-label="Assets for image generation">
        <div className="section-heading compact-heading">
          <p>Image Assets</p>
          <span>{assets.length ? `${assets.length} attached` : "Attach refs"}</span>
        </div>
        <label className="asset-dropzone">
          <span className="asset-dropzone-copy">
            <strong>Attach image references</strong>
          </span>
          <span className="asset-dropzone-action">Choose files</span>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(event) => {
              void addAssets(event.target.files);
              event.currentTarget.value = "";
            }}
          />
        </label>
        <label className="logo-toggle">
          <input
            type="checkbox"
            checked={value.includeLogo}
            onChange={(event) => update("includeLogo", event.target.checked)}
          />
          <span>
            <strong>Include {brand.name} logo in image designs</strong>
          </span>
          <img src={brand.logoSrc} alt="" />
        </label>
        {assets.length ? (
          <div className="asset-list">
            {assets.map((asset) => (
              <div className="asset-row" key={asset.id}>
                {asset.dataUrl ? <img className="asset-preview" src={asset.dataUrl} alt="" /> : <span className="asset-preview asset-preview-placeholder">Ref</span>}
                <div>
                  <strong>{asset.name}</strong>
                  <span>
                    {asset.fileType} / {formatBytes(asset.size)}
                  </span>
                  <small>
                    {asset.analysisStatus === "pending"
                      ? "Analyzing visual reference..."
                      : asset.summary ?? "Reference attached."}
                  </small>
                </div>
                <select value={asset.role} onChange={(event) => updateAssetRole(asset.id, event.target.value as CampaignAsset["role"])}>
                  <option value="product">Product</option>
                  <option value="brand">Brand</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="reference">Reference</option>
                </select>
                <button className="icon-text-button" type="button" onClick={() => removeAsset(asset.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <label className="notes-field">
          Image generation notes
          <textarea
            value={value.assetNotes}
            onChange={(event) => update("assetNotes", event.target.value)}
            rows={4}
            placeholder="Describe what the image generator should use, avoid, preserve, or create."
          />
        </label>
      </div>

      <button className="primary-button" type="button" onClick={onGenerate}>
        Generate Campaign Package
      </button>
    </section>
  );
}
