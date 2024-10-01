/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `visits` on the `Url` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Url" DROP CONSTRAINT "Url_ownerId_fkey";

-- DropIndex
DROP INDEX "Url_shortUrl_key";

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "createdAt",
DROP COLUMN "ownerId",
DROP COLUMN "updatedAt",
DROP COLUMN "visits",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
