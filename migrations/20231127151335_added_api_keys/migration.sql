-- CreateTable
CREATE TABLE "Apikeys" (
    "id" SERIAL NOT NULL,
    "orgId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "creatorEmail" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Apikeys_pkey" PRIMARY KEY ("id")
);
