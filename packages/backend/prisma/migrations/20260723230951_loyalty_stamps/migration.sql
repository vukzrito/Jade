-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "stamps" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "stamps_earned" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "reward_threshold" INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE "redeemed_rewards" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "appointment_id" TEXT,
    "service_id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "stamps_used" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redeemed_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "redeemed_rewards_client_id_idx" ON "redeemed_rewards"("client_id");

-- AddForeignKey
ALTER TABLE "redeemed_rewards" ADD CONSTRAINT "redeemed_rewards_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeemed_rewards" ADD CONSTRAINT "redeemed_rewards_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeemed_rewards" ADD CONSTRAINT "redeemed_rewards_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
