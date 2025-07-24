/*
  Warnings:

  - Added the required column `rtmpsURL` to the `LiveStream` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LiveStream" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "streamKey" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "rtmpsURL" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "LiveStream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LiveStream" ("created_at", "description", "id", "streamId", "streamKey", "title", "updated_at", "userId") SELECT "created_at", "description", "id", "streamId", "streamKey", "title", "updated_at", "userId" FROM "LiveStream";
DROP TABLE "LiveStream";
ALTER TABLE "new_LiveStream" RENAME TO "LiveStream";
CREATE UNIQUE INDEX "LiveStream_streamId_key" ON "LiveStream"("streamId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
