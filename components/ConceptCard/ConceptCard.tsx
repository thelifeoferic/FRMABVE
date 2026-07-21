import type { VisualConcept } from "@/lib/types/campaign";

type ConceptCardProps = {
  concept: VisualConcept;
  selected: boolean;
  onSelect: () => void;
};

export function ConceptCard({ concept, selected, onSelect }: ConceptCardProps) {
  return (
    <button className={`concept-card ${selected ? "selected" : ""}`} onClick={onSelect} type="button">
      <img className="concept-image" src={concept.heroImage} alt={`${concept.name} visual direction`} />
      <span className="concept-copy">
        <span className="concept-title">{concept.name}</span>
        <span>{concept.direction}</span>
      </span>
    </button>
  );
}
