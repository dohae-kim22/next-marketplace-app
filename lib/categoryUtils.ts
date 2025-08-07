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
