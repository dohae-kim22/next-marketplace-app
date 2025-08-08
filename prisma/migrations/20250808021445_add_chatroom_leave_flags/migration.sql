-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "buyerLeft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerLeft" BOOLEAN NOT NULL DEFAULT false;
