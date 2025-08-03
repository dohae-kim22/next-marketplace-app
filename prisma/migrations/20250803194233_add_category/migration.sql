-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryMain" TEXT NOT NULL DEFAULT 'Uncategorized',
ADD COLUMN     "categorySub" TEXT,
ADD COLUMN     "categorySubSub" TEXT;
