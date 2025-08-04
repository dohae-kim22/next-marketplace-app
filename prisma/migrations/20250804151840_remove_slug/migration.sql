/*
  Warnings:

  - You are about to drop the column `categoryMainSlug` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `categorySubSlug` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `categorySubSubSlug` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryMainSlug",
DROP COLUMN "categorySubSlug",
DROP COLUMN "categorySubSubSlug";
