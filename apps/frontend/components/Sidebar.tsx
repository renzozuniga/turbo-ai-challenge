import type { Category } from "@/lib/types";

interface SidebarProps {
  categories: Category[];
}

export function Sidebar({ categories }: SidebarProps) {
  return (
    <aside className="relative top-[101px] left-[23px] w-[256px] h-[128px] rotate-0 opacity-100 shrink-0">
      <h2 className="mb-3 font-sans text-xs font-bold text-ink">All Categories</h2>
      <ul className="flex flex-col gap-2.5">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between gap-2 font-sans text-xs font-normal text-ink"
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
          </li>
        ))}
      </ul>
    </aside>
  );
}
