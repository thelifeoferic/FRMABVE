const brandKits = [
  {
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
    name: "Plant Bar",
    description: "Coffee, tea, boba, and zero-proof brand direction for mood-led campaigns.",
    logo: "/brand-kit/plant-bar/plant-bar-logo-wide.png",
    fonts: [
      ["Archivo-style sans", ""],
      ["Scotch-style editorial serif", ""],
      ["Warm script accent", ""]
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

export default function SettingsPage() {
  return (
    <main className="settings-page brand-kit-page">
      <section className="panel brand-kit-hero">
        <div className="section-heading">
          <p>Brand Kit</p>
          <span>Download center</span>
        </div>
        <h1>Brand assets, fonts, colors, and guidelines.</h1>
        <p>
          Keep the campaign studio and the final creative working from the same source of truth.
        </p>
        <div className="settings-actions">
          <a className="ghost-link" href="/">
            Back to Campaign Studio
          </a>
          <a className="ghost-link" href="/prompts">
            Open AI Prompts
          </a>
        </div>
      </section>

      <section className="panel cta-spec-card" aria-label="Asheville CTA button specs">
        <div className="section-heading">
          <p>CTA Button Specs</p>
          <span>Canva-ready</span>
        </div>
        <div className="cta-spec-preview" aria-label="CTA button preview">
          <span>Shop All THCA Flower</span>
        </div>
        <div className="cta-spec-grid">
          {ctaButtonSpecs.map(([label, value]) => (
            <div className="cta-spec-row" key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="brand-kit-grid" aria-label="Downloadable brand assets">
        {brandKits.map((brand) => (
          <article className="panel brand-kit-card" key={brand.name}>
            <div className="brand-kit-card-header">
              <img src={brand.logo} alt={`${brand.name} logo`} />
              <div>
                <p>{brand.name}</p>
                <span>{brand.description}</span>
              </div>
            </div>

            <div className="brand-kit-section">
              <h2>Colors</h2>
              <div className="brand-color-grid">
                {brand.colors.map(([name, color]) => (
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
                {brand.fonts.map(([label, href]) => (
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
              <h2>Downloads</h2>
              <div className="brand-download-list">
                {brand.downloads.map(([label, href]) => (
                  <a href={href} download key={href}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
