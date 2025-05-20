/*
  Warnings:

  - The primary key for the `Certificate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `departmentId` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `diplomaId` on the `Certificate` table. All the data in the column will be lost.
  - The `id` column on the `Certificate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Diploma` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `departmentId` on the `Diploma` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Diploma` table. All the data in the column will be lost.
  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GraduationStatusEnum" AS ENUM ('SYSTEM_APPROVAL', 'ADVISOR_APPROVAL', 'DEPARTMENT_SECRETARIAT_APPROVAL', 'FACULTY_SECRETARIAT_APPROVAL', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_diplomaId_fkey";

-- DropForeignKey
ALTER TABLE "Diploma" DROP CONSTRAINT "Diploma_departmentId_fkey";

-- DropIndex
DROP INDEX "Certificate_departmentId_idx";

-- DropIndex
DROP INDEX "Certificate_diplomaId_idx";

-- DropIndex
DROP INDEX "Diploma_departmentId_idx";

-- DropIndex
DROP INDEX "Diploma_studentId_idx";

-- AlterTable
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_pkey",
DROP COLUMN "departmentId",
DROP COLUMN "diplomaId",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Diploma" DROP CONSTRAINT "Diploma_pkey",
DROP COLUMN "departmentId",
DROP COLUMN "id",
ADD CONSTRAINT "Diploma_pkey" PRIMARY KEY ("studentId");

-- DropTable
DROP TABLE "Unit";

-- CreateTable
CREATE TABLE "DeptSecretariat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "DeptSecretariat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacSecretariat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "facultyId" INTEGER NOT NULL,

    CONSTRAINT "FacSecretariat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraduationStatus" (
    "studentId" INTEGER NOT NULL,
    "status" "GraduationStatusEnum" NOT NULL,
    "processedByAdvisorId" INTEGER,
    "processedByDeptSecretariatId" INTEGER,
    "processedByFacSecretariatId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GraduationStatus_pkey" PRIMARY KEY ("studentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeptSecretariat_email_key" ON "DeptSecretariat"("email");

-- CreateIndex
CREATE INDEX "DeptSecretariat_departmentId_idx" ON "DeptSecretariat"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "FacSecretariat_email_key" ON "FacSecretariat"("email");

-- CreateIndex
CREATE INDEX "FacSecretariat_facultyId_idx" ON "FacSecretariat"("facultyId");

-- CreateIndex
CREATE INDEX "GraduationStatus_studentId_idx" ON "GraduationStatus"("studentId");

-- CreateIndex
CREATE INDEX "GraduationStatus_processedByAdvisorId_idx" ON "GraduationStatus"("processedByAdvisorId");

-- CreateIndex
CREATE INDEX "GraduationStatus_processedByDeptSecretariatId_idx" ON "GraduationStatus"("processedByDeptSecretariatId");

-- CreateIndex
CREATE INDEX "GraduationStatus_processedByFacSecretariatId_idx" ON "GraduationStatus"("processedByFacSecretariatId");

-- CreateIndex
CREATE UNIQUE INDEX "GraduationStatus_studentId_status_key" ON "GraduationStatus"("studentId", "status");

-- CreateIndex
CREATE INDEX "Department_facultyId_idx" ON "Department"("facultyId");

-- AddForeignKey
ALTER TABLE "DeptSecretariat" ADD CONSTRAINT "DeptSecretariat_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacSecretariat" ADD CONSTRAINT "FacSecretariat_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationStatus" ADD CONSTRAINT "GraduationStatus_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationStatus" ADD CONSTRAINT "GraduationStatus_processedByAdvisorId_fkey" FOREIGN KEY ("processedByAdvisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationStatus" ADD CONSTRAINT "GraduationStatus_processedByDeptSecretariatId_fkey" FOREIGN KEY ("processedByDeptSecretariatId") REFERENCES "DeptSecretariat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationStatus" ADD CONSTRAINT "GraduationStatus_processedByFacSecretariatId_fkey" FOREIGN KEY ("processedByFacSecretariatId") REFERENCES "FacSecretariat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
