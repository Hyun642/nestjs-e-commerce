/*
  Warnings:

  - You are about to drop the column `productOptionUnitId` on the `CartItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productOptionUnitId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "productOptionUnitId";

-- CreateTable
CREATE TABLE "CartItemOptionUnit" (
    "cartItemId" INTEGER NOT NULL,
    "productOptionUnitId" INTEGER NOT NULL,

    CONSTRAINT "CartItemOptionUnit_pkey" PRIMARY KEY ("cartItemId","productOptionUnitId")
);

-- AddForeignKey
ALTER TABLE "CartItemOptionUnit" ADD CONSTRAINT "CartItemOptionUnit_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemOptionUnit" ADD CONSTRAINT "CartItemOptionUnit_productOptionUnitId_fkey" FOREIGN KEY ("productOptionUnitId") REFERENCES "ProductOptionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
