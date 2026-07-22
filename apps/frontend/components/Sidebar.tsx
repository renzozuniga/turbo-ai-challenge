import type { Category } from "@/lib/types";

interface SidebarProps {
  categories: Category[];
  activeCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export function Sidebar({ categories, activeCategoryId, onSelectCategory }: SidebarProps) {
  return (
    <aside className="w-[256px] shrink-0">
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className="mb-3 block font-sans text-xs font-bold text-ink"
      >
        All Categories
      </button>
      <ul className="flex flex-col gap-2.5">
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={`flex w-full items-center justify-between gap-2 font-sans text-xs text-ink ${
                  isActive ? "font-bold" : "font-normal"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                    aria-hidden
                  />
                  {category.name}
                </span>
                {category.note_count > 0 && <span className="text-ink/60">{category.note_count}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
