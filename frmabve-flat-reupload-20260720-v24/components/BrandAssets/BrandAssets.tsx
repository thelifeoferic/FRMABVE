import { defaultBrand } from "@/lib/brand/default-brand";

export function BrandAssets() {
  return (
    <aside className="brand-assets" aria-label="Brand assets">
      <img src="/logos/asheville-dispensary-logo.png" alt="Asheville Dispensary logo" />
      <div>
        <strong>{defaultBrand.name}</strong>
        <p>{defaultBrand.promise}</p>
      </div>
      <div>
        {defaultBrand.voice.map((voice) => (
          <span key={voice}>{voice}</span>
        ))}
      </div>
    </aside>
  );
}
