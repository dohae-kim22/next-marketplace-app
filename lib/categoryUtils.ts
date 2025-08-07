import { Category, mainCategories } from "@/constants/categories";

export function findCategoryBySlugs(slugs: string[]): Category | null {
  let currentLevel = mainCategories;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const category = currentLevel.find((c) => c.slug === slug);
    if (!category) return null;
    if (i === slugs.length - 1) return category;
    currentLevel = category.sub ?? [];
  }

  return null;
}

export function findCategorySlugsByIds(ids: string[]): string[] {
  let currentLevel = mainCategories;
  const slugs: string[] = [];

  for (const id of ids) {
    const match = currentLevel.find((cat) => cat.id === id);
    if (!match) break;

    slugs.push(match.slug);
    currentLevel = match.sub ?? [];
  }

  return slugs;
}
