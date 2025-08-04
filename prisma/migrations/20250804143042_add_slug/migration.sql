-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryMainSlug" TEXT NOT NULL DEFAULT 'uncategorized',
ADD COLUMN     "categorySubSlug" TEXT,
ADD COLUMN     "categorySubSubSlug" TEXT;
