type AppHeaderProps = {
  active: "studio" | "settings" | "prompts";
  brandId?: string;
  brandName?: string;
};

function normalizeBrandSlug(brandId?: string) {
  return brandId === "plant-bar" ? "plant-bar" : "asheville";
}

export function AppHeader({ active, brandId, brandName }: AppHeaderProps) {
  const brandSlug = normalizeBrandSlug(brandId);

  return (
    <header className="app-header" aria-label="FRM ABVE navigation">
      <a className="app-header-mark" href="/">
        FRM ABVE
      </a>
      <nav className="app-header-nav" aria-label="Primary">
        <a className={active === "studio" ? "active" : ""} href="/">
          Studio
        </a>
        <a className={active === "settings" ? "active" : ""} href={`/settings?brand=${brandSlug}`}>
          Brand Kit
        </a>
        <a className={active === "prompts" ? "active" : ""} href={`/prompts?brand=${brandSlug}`}>
          AI Prompts
        </a>
      </nav>
      {brandName ? <span className="app-header-context">{brandName}</span> : null}
    </header>
  );
}
