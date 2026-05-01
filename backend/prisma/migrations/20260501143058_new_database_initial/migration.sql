-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('customer', 'vendor', 'rider', 'restaurant', 'superadmin', 'organization', 'admin');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('funding', 'order_payment', 'withdrawal', 'savings_deposit');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('assigned', 'picked_up', 'in_transit', 'delivered');

-- CreateEnum
CREATE TYPE "ProcurementStatus" AS ENUM ('evaluating', 'approved', 'purchased', 'shipped', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('open', 'reviewing', 'resolved', 'rejected');

-- CreateTable
CREATE TABLE "genders" (
    "id" SERIAL NOT NULL,
    "sex" VARCHAR(10) NOT NULL,

    CONSTRAINT "genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "other_name" VARCHAR(255),
    "gender_id" INTEGER NOT NULL,
    "phone" VARCHAR(20),
    "nationality" VARCHAR(50) DEFAULT 'Nigerian',
    "state_id" INTEGER,
    "lga_id" INTEGER,
    "city" VARCHAR(100),
    "address" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "nin" VARCHAR(11),
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'customer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'NGN',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" SERIAL NOT NULL,
    "wallet_id" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "reference" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_goals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "goal_name" VARCHAR(255) NOT NULL,
    "target_amount" DECIMAL(15,2) NOT NULL,
    "current_balance" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "is_locked" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "savings_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "business_name" VARCHAR(255) NOT NULL,
    "vendor_type" VARCHAR(50) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "rating_stars" INTEGER NOT NULL DEFAULT 0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "base_price" DECIMAL(15,2) NOT NULL,
    "unit_type" VARCHAR(20) NOT NULL DEFAULT 'piece',
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "stock_threshold" INTEGER NOT NULL DEFAULT 5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "size" VARCHAR(20),
    "color" VARCHAR(50),
    "price_override" DECIMAL(15,2),
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "sku" VARCHAR(100),

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'unpaid',
    "order_status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "landmark_address" TEXT,
    "otp_code" VARCHAR(6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "variant_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "price_at_purchase" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "rider_id" INTEGER NOT NULL,
    "delivery_fee" DECIMAL(10,2) NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'assigned',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" SERIAL NOT NULL,
    "referrer_id" INTEGER NOT NULL,
    "referee_id" INTEGER NOT NULL,
    "bonus_amount" DECIMAL(10,2) NOT NULL DEFAULT 500.00,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_procurements" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_url" TEXT NOT NULL,
    "estimated_cost" DECIMAL(15,2) NOT NULL,
    "shipping_customs_fee" DECIMAL(15,2) NOT NULL,
    "service_fee" DECIMAL(15,2) NOT NULL,
    "final_total" DECIMAL(15,2) NOT NULL,
    "status" "ProcurementStatus" NOT NULL DEFAULT 'evaluating',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_procurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disputes" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER,
    "session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" SERIAL NOT NULL,
    "cart_id" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local_governments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "state_id" INTEGER NOT NULL,

    CONSTRAINT "local_governments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nin_key" ON "users"("nin");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_transactions_reference_key" ON "wallet_transactions"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_user_id_key" ON "vendors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_order_id_key" ON "deliveries"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referee_id_key" ON "referrals"("referee_id");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "carts_session_id_key" ON "carts"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "genders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lga_id_fkey" FOREIGN KEY ("lga_id") REFERENCES "local_governments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_goals" ADD CONSTRAINT "savings_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_procurements" ADD CONSTRAINT "external_procurements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "states_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local_governments" ADD CONSTRAINT "local_governments_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
