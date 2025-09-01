/*
  Warnings:

  - The primary key for the `ProductReview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProductReview` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `score` on the `ProductReview` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productReviewId` on the `ProductReviewImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReviewScore" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- DropForeignKey
ALTER TABLE "ProductReviewImage" DROP CONSTRAINT "ProductReviewImage_productReviewId_fkey";

-- AlterTable
ALTER TABLE "ProductReview" DROP CONSTRAINT "ProductReview_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "score",
ADD COLUMN     "score" "ReviewScore" NOT NULL,
ADD CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductReviewImage" DROP COLUMN "productReviewId",
ADD COLUMN     "productReviewId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductReviewImage" ADD CONSTRAINT "ProductReviewImage_productReviewId_fkey" FOREIGN KEY ("productReviewId") REFERENCES "ProductReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
