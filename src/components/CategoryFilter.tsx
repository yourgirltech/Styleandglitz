interface CategoryFilterProps {
  options: readonly string[];
  active: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({ options, active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onChange("All")}
        className={`eyebrow px-5 py-2.5 border transition-colors duration-500 ${
          active === "All"
            ? "bg-forest text-cream border-forest"
            : "border-stone-dark text-graphite/70 hover:border-forest hover:text-forest"
        }`}
      >
        All
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`eyebrow px-5 py-2.5 border transition-colors duration-500 ${
            active === opt
              ? "bg-forest text-cream border-forest"
              : "border-stone-dark text-graphite/70 hover:border-forest hover:text-forest"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
