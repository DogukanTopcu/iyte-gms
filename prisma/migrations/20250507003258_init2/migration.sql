/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `facultyId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `Admin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_unitId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "departmentId",
DROP COLUMN "facultyId",
DROP COLUMN "unitId";
