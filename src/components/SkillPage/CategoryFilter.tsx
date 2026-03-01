import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
  skillCounts: Record<string, number>;
}

const CategoryFilter = ({
  categories,
  activeCategory,
  onSelect,
  skillCounts,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect("All")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          activeCategory === "All"
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
        }`}
      >
        All
        <span className="ml-1.5 opacity-60">
          {Object.values(skillCounts).reduce((a, b) => a + b, 0)}
        </span>
      </motion.button>
      {categories.map((cat) => (
        <motion.button
          key={cat}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(cat)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeCategory === cat
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
          }`}
        >
          {cat}
          <span className="ml-1.5 opacity-60">{skillCounts[cat] || 0}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
