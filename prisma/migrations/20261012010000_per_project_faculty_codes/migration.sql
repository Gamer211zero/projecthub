ALTER TABLE "Project"
ADD COLUMN "verificationCodeHash" TEXT,
ADD COLUMN "verificationCodeExpiresAt" TIMESTAMP(3);
