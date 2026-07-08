import type { CampaignStrategy } from "@/lib/types/campaign";

type StrategyPanelProps = {
  strategy: CampaignStrategy | null;
};

export function StrategyPanel({ strategy }: StrategyPanelProps) {
  if (!strategy) {
    return (
      <section className="panel empty-panel" aria-label="Campaign strategy">
        <p>Campaign Strategy</p>
        <span>Generate a campaign to see the creative director output.</span>
      </section>
    );
  }

  return (
    <section className="panel strategy-panel" aria-label="Campaign strategy">
      <div className="section-heading">
        <p>Campaign Strategy</p>
        <span>Creative Director</span>
      </div>
      <div className="strategy-hero">
        <h2>{strategy.headline}</h2>
        <p>{strategy.subheadline}</p>
      </div>
      <p className="supporting-copy">{strategy.supportingCopy}</p>
      <div className="strategy-list">
        {strategy.sections.map((section) => (
          <span key={section}>{section}</span>
        ))}
      </div>
      <dl>
        <div>
          <dt>Layout</dt>
          <dd>{strategy.recommendedLayout}</dd>
        </div>
        <div>
          <dt>Photography</dt>
          <dd>{strategy.photographyDirection}</dd>
        </div>
        <div>
          <dt>Color</dt>
          <dd>{strategy.colorTreatment}</dd>
        </div>
        <div>
          <dt>Hierarchy</dt>
          <dd>{strategy.visualHierarchy}</dd>
        </div>
      </dl>
    </section>
  );
}
