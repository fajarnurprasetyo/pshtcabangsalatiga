-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "encrypted_password" CHAR(60) NOT NULL,
    "email_confirmation_token" CHAR(6),
    "email_confirmed_at" TIMESTAMP(3),
    "phone" TEXT,
    "phone_confirmation_token" CHAR(6),
    "phone_confirmed_at" TIMESTAMP(3),
    "branch" TEXT,
    "sub_branch" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
