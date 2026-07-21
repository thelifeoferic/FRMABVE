import { AppHeader } from "@/components/AppHeader/AppHeader";

const brandKits = [
  {
    id: "asheville",
    name: "Asheville Dispensary",
    description: "Cannabis, apothecary, and lounge assets for campaign work.",
    logo: "/brand-imagery/asheville-round-logo.png",
    fonts: [
      ["Iskra Regular", "/brand-kit/asheville-dispensary/fonts/iskra-w01-regular.ttf"],
      ["Iskra Medium", "/brand-kit/asheville-dispensary/fonts/iskra-w01-medium.ttf"],
      ["Iskra Bold", "/brand-kit/asheville-dispensary/fonts/iskra-w01-bold.ttf"],
      ["Montserrat", "/brand-kit/asheville-dispensary/fonts/montserrat-variable.ttf"],
      ["Montserrat Italic", "/brand-kit/asheville-dispensary/fonts/montserrat-italic-variable.ttf"]
    ],
    typography: [
      ["Display", "The quick brown fox", "Iskra Medium/Bold", "64-96 px", "90-110%", "#151514"],
      ["Heading 1", "The quick brown fox", "Iskra Medium/Bold", "48-64 px", "100-110%", "#151514"],
      ["Heading 2", "The quick brown fox jumps over", "Iskra Medium", "30-42 px", "110-120%", "#151514"],
      ["Body", "The quick brown fox jumps over the lazy dog.", "Montserrat Regular/Medium", "16-18 px", "145-155%", "#151514"],
      ["CTA", "Shop All THCA Flower", "Montserrat SemiBold/Bold", "31-34 px", "100%", "#F7F5EF"]
    ],
    colorGroups: [
      {
        title: "Main Brand",
        colors: [
          ["Primary green", "#497030"],
          ["Deep green", "#263E22"],
          ["Near black", "#21211F"],
          ["Warm tan", "#E3D4C7"],
          ["Pale green", "#D5E0C4"]
        ]
      },
      {
        title: "Text",
        colors: [
          ["Ink", "#151514"],
          ["Cream text", "#F7F5EF"]
        ]
      },
      {
        title: "Effects",
        colors: [
          ["Chill", "#8F8DFF"],
          ["Creative", "#F79685"],
          ["Energetic", "#EC5B1C"],
          ["Euphoric", "#4FA565"],
          ["Focus", "#DD893C"],
          ["Happy", "#E9B600"],
          ["Relief", "#BF2033"],
          ["Sleepy", "#244777"]
        ]
      },
      {
        title: "Seltzer",
        colors: [
          ["Uplift", "#CF7B3C"],
          ["Mellow", "#1C3D5F"],
          ["Elevation", "#80CCE2"],
          ["Cosmic", "#ADD55D"],
          ["Bliss", "#408076"]
        ]
      }
    ],
    downloads: [
      ["All Iskra fonts", "/brand-kit/asheville-dispensary/fonts/iskra-fonts.zip"],
      ["All Montserrat fonts", "/brand-kit/asheville-dispensary/fonts/montserrat-fonts.zip"],
      ["Primary logo", "/brand-kit/asheville-dispensary/asheville-dispensary-logo.png"],
      ["Round logo", "/brand-kit/asheville-dispensary/asheville-dispensary-logo-round.png"],
      ["Hero logo", "/brand-imagery/asheville-round-logo.png"],
      ["Leaf hero image", "/brand-imagery/asheville-leaf-hero.jpg"],
      ["Brand notes", "/brand-kit/asheville-dispensary/asheville-dispensary-brand-notes.txt"],
      ["CTA button specs", "/brand-kit/asheville-dispensary/asheville-cta-button-specs.txt"],
      ["Weekly Strain prompt", "/brand-kit/asheville-dispensary/prompts/weekly-strain-integrity.txt"]
    ]
  },
  {
    id: "plant-bar",
    name: "Plant Bar",
    description: "Coffee, tea, boba, and zero-proof brand direction for mood-led campaigns.",
    logo: "/brand-kit/plant-bar/plant-bar-logo-wide.png",
    fonts: [
      ["Archivo-style sans", ""],
      ["Scotch-style editorial serif", ""],
      ["Warm script accent", ""]
    ],
    typography: [
      ["Editorial title", "Summer Seasonal Menu", "Plant Bar serif", "54-76 px", "95-105%", "#061F33"],
      ["Mood line", "Honey, citrus, mint, hibiscus & rose.", "Warm script accent", "30-42 px", "105-115%", "#704F49"],
      ["Body", "Fresh flavors, summer mood, sunny days.", "Clean sans", "18-22 px", "145%", "#455B61"],
      ["CTA", "See The Seasonal Menu →", "Clean sans Bold", "20-24 px", "100%", "#FFFFFF"]
    ],
    colorGroups: [
      {
        title: "Plant Bar",
        colors: [
          ["Mint", "#E5F5EF"],
          ["Blush", "#FFA2A8"],
          ["Navy", "#061F33"],
          ["Cocoa", "#704F49"],
          ["Tea amber", "#D9A45F"],
          ["Cream", "#F4EFE6"]
        ]
      }
    ],
    downloads: [
      ["Logo PNG", "/brand-kit/plant-bar/plant-bar-logo-wide.png"],
      ["Logo SVG", "/brand-kit/plant-bar/plant-bar-logo.svg"],
      ["Brand guide PDF", "/brand-kit/plant-bar/plant-bar-brand-guide.pdf"],
      ["Brand notes", "/brand-kit/plant-bar/plant-bar-brand-notes.txt"]
    ]
  }
];

const ctaButtonSpecs = [
  ["Canvas", "878 x 230 px"],
  ["Background", "#f3eee6 cream"],
  ["Button size", "685 x 108 px"],
  ["Button position", "X 104 px, Y 62 px"],
  ["Button fill", "#497030"],
  ["Hover fill", "#719060"],
  ["Corner radius", "2-3 px"],
  ["Text", "Montserrat SemiBold or Bold"],
  ["Text size", "31-34 px"],
  ["Text color", "#ffffff"],
  ["Letter spacing", "4-6% in Canva"],
  ["Alignment", "Center text horizontally and vertically"],
  ["Effects", "No shadow, no outline"]
];

const plantBarCtaButtonSpecs = [
  ["Canvas", "878 x 230 px"],
  ["Background", "#f4efe6 cream"],
  ["Button size", "554 x 92 px"],
  ["Button fill", "#061f33"],
  ["Hover fill", "#12364f"],
  ["Corner radius", "999 px"],
  ["Text", "Clean sans, Bold"],
  ["Text size", "22-26 px"],
  ["Text color", "#ffffff"],
  ["Letter spacing", "12-16% in Canva"],
  ["Alignment", "Center text horizontally and vertically"],
  ["Accent", "Right arrow at end of CTA"],
  ["Effects", "No shadow, no outline"]
];

type SettingsPageProps = {
  searchParams: Promise<{ brand?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const activeBrand = brandKits.find((brand) => brand.id === params.brand) ?? brandKits[0];
  const isAsheville = activeBrand.id === "asheville";
  const currentCtaSpecs = isAsheville ? ctaButtonSpecs : plantBarCtaButtonSpecs;

  return (
    <main className="settings-page brand-kit-page" data-brand={activeBrand.id}>
      <AppHeader active="settings" brandId={activeBrand.id} brandName={activeBrand.name} />

      <section className="panel brand-kit-hero">
        <div className="brand-kit-hero-grid">
          <div>
            <div className="section-heading">
              <p>Brand Kit</p>
              <span>{activeBrand.name}</span>
            </div>
            <h1>Brand assets, fonts, colors, and guidelines.</h1>
            <p>
              Keep the campaign studio and the final creative working from the same source of truth.
            </p>
            <div className="settings-actions">
              <a className="ghost-link" href="/">
                Back to Campaign Studio
              </a>
              <a className="ghost-link" href={`/prompts?brand=${activeBrand.id}`}>
                Open AI Prompts
              </a>
            </div>
          </div>

          <aside className="brand-kit-quick-downloads" aria-label={`${activeBrand.name} quick downloads`}>
            <div className="section-heading">
              <p>Assets</p>
              <span aria-hidden="true" className="download-icon">↓</span>
            </div>
            <div className="brand-download-list">
              {activeBrand.downloads.map(([label, href]) => (
                <a href={href} download key={href}>
                  {label}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <nav className="prompt-tabs brand-tabs" aria-label="Brand kit selector">
        {brandKits.map((brand) => (
          <a className={brand.id === activeBrand.id ? "active" : ""} href={`/settings?brand=${brand.id}`} key={brand.id}>
            {brand.name}
          </a>
        ))}
      </nav>

      <nav className="brand-kit-jump-nav" aria-label="Brand kit sections">
        <a href="#assets">Assets</a>
        <a href="#colors">Colors</a>
        <a href="#typography">Typography</a>
        <a href="#buttons">Buttons</a>
        {isAsheville ? <a href="#commerce">Commerce UI</a> : null}
      </nav>

      <section className="panel cta-spec-card" id="buttons" aria-label={`${activeBrand.name} CTA button specs`}>
          <div className="section-heading">
            <p>CTA Button Specs</p>
            <span>Canva-ready</span>
          </div>
          <div className={isAsheville ? "cta-spec-preview" : "cta-spec-preview plant-bar-cta-preview"} aria-label="CTA button preview">
            {isAsheville ? (
              <span>Shop All THCA Flower</span>
            ) : (
              <span>See The Seasonal Menu →</span>
            )}
          </div>
          <div className="cta-spec-grid">
            {currentCtaSpecs.map(([label, value]) => (
              <div className="cta-spec-row" key={label}>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </section>

      <section className="brand-kit-grid" id="assets" aria-label="Downloadable brand assets">
        <article className="panel brand-kit-card" key={activeBrand.name}>
          <div className="brand-kit-card-grid">
            <div className="brand-kit-primary-column">
              <div className="brand-kit-card-header">
                <img src={activeBrand.logo} alt={`${activeBrand.name} logo`} />
                <div>
                  <p>{activeBrand.name}</p>
                  <span>{activeBrand.description}</span>
                </div>
              </div>

              <div className="brand-kit-section" id="colors">
                <h2>Colors</h2>
                <div className="brand-color-groups">
                  {activeBrand.colorGroups.map((group) => (
                    <div className="brand-color-group" key={group.title}>
                      <h3>{group.title}</h3>
                      <div className="brand-color-grid">
                        {group.colors.map(([name, color]) => (
                          <div className="brand-color-chip" key={color}>
                            <span style={{ backgroundColor: color }} />
                            <strong>{name}</strong>
                            <code>{color}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="brand-kit-section">
                <h2>Font downloads</h2>
                {isAsheville ? (
                  <div className="font-bundle-list">
                    <a href="/brand-kit/asheville-dispensary/fonts/iskra-fonts.zip" download>
                      Download all Iskra
                    </a>
                    <a href="/brand-kit/asheville-dispensary/fonts/montserrat-fonts.zip" download>
                      Download all Montserrat
                    </a>
                  </div>
                ) : null}
                <div className="brand-font-list">
                  {activeBrand.fonts.map(([label, href]) => (
                    href ? (
                      <a href={href} download key={href}>
                        {label}
                      </a>
                    ) : (
                      <span key={label}>{label}</span>
                    )
                  ))}
                </div>
              </div>

              <div className="brand-kit-section" id="typography">
                <h2>Typography</h2>
                <div className="brand-type-scale">
                  {activeBrand.typography.map(([label, sample, family, size, lineHeight, color]) => (
                    <div className="brand-type-row" key={label}>
                      <div>
                        <strong>{label}</strong>
                        <p>{sample}</p>
                      </div>
                      <dl>
                        <div>
                          <dt>Font</dt>
                          <dd>{family}</dd>
                        </div>
                        <div>
                          <dt>Size</dt>
                          <dd>{size}</dd>
                        </div>
                        <div>
                          <dt>Line</dt>
                          <dd>{lineHeight}</dd>
                        </div>
                        <div>
                          <dt>Color</dt>
                          <dd>{color}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              </div>

              {isAsheville ? (
                <div className="brand-kit-section" id="commerce">
                  <h2>Commerce UI</h2>
                  <div className="commerce-guidelines">
                    <article className="product-card-spec">
                      <div className="product-image-frame">
                        <span className="effect-badge">Euphoric</span>
                        <div className="flower-shape" aria-hidden="true" />
                        <span className="thca-badge">THCA: 36%</span>
                      </div>
                      <small>Private Reserve</small>
                      <h3>Super Boof THCA Flower</h3>
                      <p>159 reviews</p>
                      <strong>From: $13</strong>
                      <div className="product-actions">
                        <span>Select Options</span>
                        <span>View Product</span>
                      </div>
                    </article>

                    <article className="icon-tile-spec">
                      <div className="icon-grid-spec">
                        {[
                          ["□", "Free Nation-wide Shipping over $99"],
                          ["♧", "Satisfaction Guaranteed"],
                          ["✺", "Organic Products"],
                          ["⌬", "DEA Certified Lab Testing"],
                          ["▭", "Secure Payment"],
                          ["▤", "No Medical Card Needed"]
                        ].map(([icon, label]) => (
                          <div key={label}>
                            <span>{icon}</span>
                            <strong>{label}</strong>
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
