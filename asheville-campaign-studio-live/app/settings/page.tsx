const brandKits = [
  {
    name: "Asheville Dispensary",
    description: "Cannabis, apothecary, and lounge assets for campaign work.",
    logo: "/brand-kit/asheville-dispensary/asheville-dispensary-logo.png",
    fonts: ["Iskra W01", "Montserrat", "Compact campaign copy"],
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
      ["Brand notes", "/brand-kit/asheville-dispensary/asheville-dispensary-brand-notes.txt"],
      ["Iskra Regular", "/brand-kit/asheville-dispensary/fonts/iskra-w01-regular.ttf"],
      ["Iskra Medium", "/brand-kit/asheville-dispensary/fonts/iskra-w01-medium.ttf"],
      ["Iskra Bold", "/brand-kit/asheville-dispensary/fonts/iskra-w01-bold.ttf"],
      ["Montserrat", "/brand-kit/asheville-dispensary/fonts/montserrat-variable.ttf"],
      ["Montserrat Italic", "/brand-kit/asheville-dispensary/fonts/montserrat-italic-variable.ttf"],
      ["Weekly Strain prompt", "/brand-kit/asheville-dispensary/prompts/weekly-strain-integrity.txt"]
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

const aiRuleSets = [
  {
    brand: "Asheville Dispensary",
    name: "Weekly Strain Integrity",
    rules: [
      "Preserve the exact campaign HTML structure, spacing, classes, wrappers, media queries, card layout, buttons, and mobile formatting.",
      "Return the complete working HTML in one ready-to-paste code block, never snippets or placeholders.",
      "Use Montserrat throughout unless the existing template specifically uses Iskra for headings.",
      "Preserve cream #f3eee6, CTA green #4a6f2f, and dark green #263e22, and do not introduce black backgrounds.",
      "Keep every product or strain card fully clickable and linked to the correct product page.",
      "Preserve strain metadata as <strong>% THCA</strong> • Type • Effect.",
      "Organize flower strains under Private Reserve, Fresh Exotic, and Greenhouse.",
      "Do not invent THCA percentages, effects, strain types, prices, URLs, store details, or missing information."
    ],
    prompt:
      "Update the Asheville Dispensary weekly campaign HTML using only the provided new strains, copy, links, images, or requested changes. Preserve the original template exactly and return the full working HTML.",
    download: "/brand-kit/asheville-dispensary/prompts/weekly-strain-integrity.txt"
  },
  {
    brand: "Asheville Dispensary",
    name: "Campaign Image Direction",
    rules: [
      "Use a premium cannabis apothecary look with cream, black, deep green, and warm gold.",
      "Keep product packaging readable, centered, and fully inside the image with generous margin.",
      "Use Iskra W01 selectively for display-style Asheville brand moments and Montserrat for utility copy.",
      "Use natural shadows, restrained offer hierarchy, and product-forward composition.",
      "Avoid cluttered collage layouts, oversized cropped text, or visual noise that weakens review quality."
    ],
    prompt:
      "Create a premium Asheville Dispensary campaign image. Use product-forward composition, warm cream surfaces, deep green and gold accents, readable packaging, restrained copy hierarchy, and apothecary-lounge polish.",
    download: ""
  },
  {
    brand: "Plant Bar",
    name: "Campaign Image Direction",
    rules: [
      "Honor soft mint, blush pink, deep navy, cocoa-brown warmth, and tea/coffee amber accents.",
      "Use editorial cafe and botanical beverage styling: coffee, tea, boba, zero-proof cocktails, glassware, garnish, texture, and warm connection.",
      "Keep layouts airy, intentional, crafted, and mood-led.",
      "Use Archivo-style clarity with refined editorial serif or warm script only for short accent moments.",
      "Avoid cannabis dispensary language, neon lounge styling, heavy black packaging scenes, or loud sales graphics."
    ],
    prompt:
      "Create a Plant Bar campaign image that feels warm, botanical, and intentional. Use soft mint, blush pink, deep navy, cocoa, and tea amber with editorial cafe photography, crafted drinks, natural texture, and calm human connection.",
    download: ""
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
        <a className="ghost-link" href="/">
          Back to Campaign Studio
        </a>
      </section>

      <section className="brand-rules-grid" aria-label="AI rules and prompts">
        {aiRuleSets.map((ruleSet) => (
          <article className="panel brand-rules-card" key={ruleSet.brand}>
            <div className="section-heading">
              <p>{ruleSet.name}</p>
              <span>AI rules & prompts</span>
            </div>
            <strong className="rules-brand-label">{ruleSet.brand}</strong>
            <ul>
              {ruleSet.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <div className="prompt-card">
              <strong>Reusable prompt</strong>
              <p>{ruleSet.prompt}</p>
              {ruleSet.download ? (
                <a href={ruleSet.download} download>
                  Download full prompt
                </a>
              ) : null}
            </div>
          </article>
        ))}
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
