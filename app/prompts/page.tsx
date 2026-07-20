const promptGroups = [
  {
    id: "asheville",
    label: "Asheville",
    prompts: [
      {
        title: "Weekly Strain Integrity",
        type: "HTML update",
        summary: "Preserves an existing weekly strain email template while swapping only the new strain/product details.",
        download: "/brand-kit/asheville-dispensary/prompts/weekly-strain-integrity.txt",
        rules: [
          "Preserve exact HTML structure, spacing, wrappers, classes, card layout, buttons, and mobile formatting.",
          "Return one complete ready-to-paste HTML block.",
          "Do not invent percentages, effects, prices, links, store details, or missing data.",
          "Keep each strain card fully clickable with the correct product URL."
        ],
        code: `Weekly Strain Integrity

Update the following Asheville Dispensary weekly campaign HTML using only the new information I provide.

You must preserve the exact HTML structure, spacing, typography, responsive behavior, colors, classes, wrappers, inline styles, media queries, section hierarchy, card layout, buttons, and mobile formatting from the original template.

Do not shorten the code, simplify the design, remove sections, rename classes, change store information, rewrite unrelated copy, alter CTA styling, or modify anything I have not specifically asked you to change.

Always return the complete, fully working HTML in one ready-to-paste code block. Never return snippets, partial sections, placeholders, summaries, or instructions telling me where to insert the content.

Maintain these Asheville Dispensary standards:

- Use Montserrat throughout the campaign unless the existing template specifically uses Iskra for headings.
- Preserve the Asheville brand colors, including cream #f3eee6, CTA green #4a6f2f, and dark green #263e22.
- Preserve Asheville CTA button styling: flat #4a6f2f rectangular buttons, 2-3 px radius, centered white Montserrat SemiBold or Bold text, and no shadow unless the original template already uses one.
- Do not introduce black backgrounds.
- Keep every product or strain card fully clickable, with the entire card linking directly to the correct product page. Do not replace product links with a generic shop link.
- Preserve the exact strain metadata format: <strong>% THCA</strong> • Type • Effect.
- Organize flower strains under the correct tier headings: Private Reserve, Fresh Exotic, and Greenhouse.
- Do not invent THCA percentages, effects, strain types, prices, URLs, store details, or other missing information.
- Preserve all verified location names, addresses, phone numbers, hours, menu links, and footer information exactly unless I specifically provide replacements.
- Keep all existing desktop and mobile responsiveness intact.
- Do not change the store name, campaign location, product tier, or footer locations unless explicitly instructed.
- Only change the specific content I request.

Before returning the HTML, verify that all opening and closing tags are intact, all wrappers remain in place, all cards and buttons are clickable, all URLs are correctly assigned, and no original structural or stylistic elements have been removed.

Here is the existing HTML:

[PASTE EXISTING HTML]

Here are the only requested updates:

[PASTE NEW STRAINS, COPY, LINKS, IMAGES, OR OTHER CHANGES]`
      },
      {
        title: "Campaign Image Direction",
        type: "Image generation",
        summary: "Creates premium Asheville Dispensary campaign images with product-forward apothecary polish.",
        download: "",
        rules: [
          "Keep product packaging readable, centered, and fully inside the image.",
          "Use cream, deep green, warm gold, natural shadows, and restrained hierarchy.",
          "Avoid cropped text, cluttered collage layouts, or heavy black backgrounds."
        ],
        code: `Create a premium Asheville Dispensary campaign image.

Use product-forward composition, warm cream surfaces, deep green and warm gold accents, readable packaging, restrained copy hierarchy, and cannabis apothecary-lounge polish.

The full product or package must stay inside the frame with generous margin on all sides. Do not crop product names, CTA copy, logos, or important packaging details.

Use Iskra W01 selectively for short Asheville display moments and Montserrat for practical campaign copy. Keep the image clean, review-ready, and suitable for Klaviyo campaign approval.`
      },
      {
        title: "Logo Usage Integrity",
        type: "Brand rule",
        summary: "Protects the Asheville Dispensary logo from edits, cropping, recoloring, or distortion.",
        download: "/brand-kit/asheville-dispensary/prompts/logo-usage-integrity.txt",
        rules: [
          "Use the provided Asheville Dispensary logo exactly as shown.",
          "Keep the full logo visible with its original aspect ratio.",
          "Do not alter, redraw, crop, recolor, distort, replace, or modify any logo detail."
        ],
        code: `Asheville Dispensary Logo Usage Integrity

Use the provided Asheville Dispensary logo exactly as shown.

Do not alter, redraw, crop, recolor, distort, replace, or modify any text, symbols, proportions, or details.

Keep the logo fully visible and preserve its original aspect ratio.

When placing the logo in campaign images, brand assets, Klaviyo creative, social kit exports, or review mockups, treat the logo as a locked brand asset. It may be resized proportionally only when necessary for layout, but it must remain sharp, readable, uncropped, and visually faithful to the source file.`
      },
      {
        title: "CTA Button Integrity",
        type: "Design rule",
        summary: "Keeps Asheville email buttons consistent with the green rectangular CTA style.",
        download: "/brand-kit/asheville-dispensary/asheville-cta-button-specs.txt",
        rules: [
          "Use #4a6f2f for the primary CTA fill.",
          "Use white Montserrat SemiBold or Bold text.",
          "Use a flat rectangular button with a 2-3 px radius."
        ],
        code: `Asheville Dispensary CTA Button Specs

Canvas: 878 x 230 px
Background: #f3eee6
Button size: 685 x 108 px
Button position: X 104 px, Y 62 px
Button fill: #4a6f2f
Corner radius: 2-3 px
Text: Montserrat SemiBold or Bold, 31-34 px, #ffffff
Letter spacing: 4-6% in Canva
Alignment: centered horizontally and vertically
Effects: none

Keep the button flat and rectangular. Do not use black backgrounds for Asheville campaign CTAs.`
      }
    ]
  },
  {
    id: "plant-bar",
    label: "Plant Bar",
    prompts: [
      {
        title: "Campaign Image Direction",
        type: "Image generation",
        summary: "Creates Plant Bar images that honor the softer coffee, tea, boba, and zero-proof brand system.",
        download: "",
        rules: [
          "Use mint, blush, navy, cocoa, tea amber, and warm cafe styling.",
          "Keep the tone editorial, botanical, crafted, and mood-led.",
          "Avoid cannabis dispensary language or Asheville lounge styling."
        ],
        code: `Create a Plant Bar campaign image that feels warm, botanical, and intentional.

Use soft mint, blush pink, deep navy, cocoa, and tea amber with editorial cafe photography, crafted drinks, natural texture, and calm human connection.

The design should feel premium but approachable: specialty coffee, tea, boba, zero-proof cocktails, glassware, garnish, texture, and mood. Avoid cannabis dispensary language, neon lounge styling, heavy black packaging scenes, or loud sales graphics.`
      }
    ]
  }
];

type PromptsPageProps = {
  searchParams: Promise<{ brand?: string }>;
};

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const params = await searchParams;
  const activeGroup = promptGroups.find((group) => group.id === params.brand) ?? promptGroups[0];

  return (
    <main className="settings-page prompts-page" data-brand={activeGroup.id}>
      <section className="panel brand-kit-hero prompts-hero">
        <div className="section-heading">
          <p>AI Prompts</p>
          <span>Rule library</span>
        </div>
        <h1>Reusable AI rules without the wall of text.</h1>
        <p>
          Open only the prompt you need, copy the code, or download the saved version when it exists.
        </p>
        <div className="settings-actions">
          <a className="ghost-link" href="/">
            Back to Campaign Studio
          </a>
          <a className="ghost-link" href={`/settings?brand=${activeGroup.id}`}>
            Brand Kit
          </a>
        </div>
      </section>

      <nav className="prompt-tabs" aria-label="Prompt categories">
        {promptGroups.map((group) => (
          <a className={group.id === activeGroup.id ? "active" : ""} href={`/prompts?brand=${group.id}`} key={group.id}>
            {group.label}
          </a>
        ))}
      </nav>

      <section className="prompt-library-section" id={activeGroup.id}>
        <div className="section-heading">
          <p>{activeGroup.label}</p>
          <span>{activeGroup.prompts.length} saved prompts</span>
        </div>

        <div className="prompt-library-list">
          {activeGroup.prompts.map((prompt) => (
            <details className="panel prompt-library-card" key={prompt.title}>
              <summary>
                <span>
                  <strong>{prompt.title}</strong>
                  <em>{prompt.summary}</em>
                </span>
                <small>{prompt.type}</small>
              </summary>

              <div className="prompt-library-body">
                <div className="prompt-rule-chips">
                  {prompt.rules.map((rule) => (
                    <span key={rule}>{rule}</span>
                  ))}
                </div>

                <pre>
                  <code>{prompt.code}</code>
                </pre>

                {prompt.download ? (
                  <a className="prompt-download" href={prompt.download} download>
                    Download saved prompt
                  </a>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
