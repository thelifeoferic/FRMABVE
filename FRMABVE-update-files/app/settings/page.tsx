const brandKits = [
  {
    name: "Asheville Dispensary",
    description: "Cannabis, apothecary, and lounge assets for campaign work.",
    logo: "/brand-kit/asheville-dispensary/asheville-dispensary-logo.png",
    fonts: ["Bold clear sans", "Compact campaign copy", "Apothecary restraint"],
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
      ["Brand notes", "/brand-kit/asheville-dispensary/asheville-dispensary-brand-notes.txt"]
    ]
  },
  {
    name: "Plant Bar",
    description: "Coffee, tea, boba, and zero-proof brand direction for mood-led campaigns.",
    logo: "/brand-kit/plant-bar/plant-bar-logo.svg",
    fonts: ["Archivo-style sans", "Scotch-style editorial serif", "Warm script accent"],
    colors: [
      ["Mint", "#e5f5ef"],
      ["Blush", "#ffa2a8"],
      ["Navy", "#061f33"],
      ["Cocoa", "#704f49"],
      ["Tea amber", "#d9a45f"],
      ["Cream", "#f4efe6"]
    ],
    downloads: [
      ["Logo SVG", "/brand-kit/plant-bar/plant-bar-logo.svg"],
      ["Brand guide PDF", "/brand-kit/plant-bar/plant-bar-brand-guide.pdf"],
      ["Brand notes", "/brand-kit/plant-bar/plant-bar-brand-notes.txt"]
    ]
  }
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
        <a className="ghost-link" href="/asheville">
          Back to Campaign Studio
        </a>
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
                {brand.fonts.map((font) => (
                  <span key={font}>{font}</span>
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
