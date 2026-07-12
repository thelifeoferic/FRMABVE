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
    fontRules: [
      ["Display headings", "Use Iskra Bold or Medium for short campaign headlines and major page titles."],
      ["Body copy", "Use Montserrat Regular or Medium for paragraphs, product details, labels, and practical campaign copy."],
      ["CTA buttons", "Use Montserrat SemiBold or Bold, centered, with modest letter spacing."],
      ["Restraint", "Avoid mixing extra decorative fonts into Asheville email or campaign layouts."]
    ],
    colors: [
      ["Cream", "#f8f4ec"],
      ["Black", "#171717"],
      ["Deep green", "#1f3f21"],
      ["Moss", "#315f34"],
      ["Gold", "#c9a24a"],
      ["Cherry", "#671f34"]
    ],
    downloads: [
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
    fontRules: [
      ["Editorial titles", "Use the Plant Bar serif for menu headlines, seasonal titles, and slower editorial moments."],
      ["Body copy", "Use the clean sans for descriptions, navigation, product notes, and readable campaign copy."],
      ["Accent script", "Use the handwritten script sparingly for flavor lines or mood statements, never for long text."],
      ["CTA buttons", "Use uppercase sans, wide tracking, white text, and the deep navy rounded pill."]
    ],
    colors: [
      ["Mint", "#e5f5ef"],
      ["Blush", "#ffa2a8"],
      ["Navy", "#061f33"],
      ["Cocoa", "#704f49"],
      ["Tea amber", "#d9a45f"],
      ["Cream", "#f4efe6"]
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
  ["Button fill", "#4a6f2f"],
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
              <p>Downloads</p>
              <span>Above the fold</span>
            </div>
            <div className="brand-download-list">
              {activeBrand.downloads.slice(0, 5).map(([label, href]) => (
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

      <section className="panel cta-spec-card" aria-label={`${activeBrand.name} CTA button specs`}>
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

      <section className="brand-kit-grid" aria-label="Downloadable brand assets">
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

              <div className="brand-kit-section">
                <h2>Colors</h2>
                <div className="brand-color-grid">
                  {activeBrand.colors.map(([name, color]) => (
                    <div className="brand-color-chip" key={color}>
                      <span style={{ backgroundColor: color }} />
                      <strong>{name}</strong>
                      <code>{color}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="brand-kit-section">
                <h2>Fonts</h2>
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

              <div className="brand-kit-section">
                <h2>Font rules</h2>
                <div className="brand-font-rules">
                  {activeBrand.fontRules.map(([label, rule]) => (
                    <div className="brand-font-rule" key={label}>
                      <strong>{label}</strong>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="brand-kit-download-column">
              <div className="brand-kit-section">
                <h2>Downloads</h2>
                <p>Quick access to logos, brand notes, prompt files, and source assets for this brand.</p>
                <div className="brand-download-list">
                  {activeBrand.downloads.map(([label, href]) => (
                    <a href={href} download key={href}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
