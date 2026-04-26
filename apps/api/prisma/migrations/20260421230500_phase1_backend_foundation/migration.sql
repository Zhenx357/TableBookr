CREATE TYPE "weekday" AS ENUM (
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
);

CREATE TYPE "booking_status" AS ENUM (
  'confirmed',
  'pending'
);

CREATE TYPE "booking_source" AS ENUM (
  'website'
);

CREATE TABLE "restaurants" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "timezone" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "restaurant_settings" (
  "id" UUID NOT NULL,
  "restaurant_id" UUID NOT NULL,
  "booking_slot_minutes" INTEGER NOT NULL DEFAULT 30,
  "booking_duration_minutes" INTEGER NOT NULL DEFAULT 120,
  "max_online_party_size" INTEGER NOT NULL DEFAULT 16,
  "auto_confirm_threshold" INTEGER NOT NULL DEFAULT 99,
  "hard_capacity_limit" INTEGER NOT NULL DEFAULT 120,
  "minimum_lead_time_minutes" INTEGER NOT NULL DEFAULT 60,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "restaurant_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "opening_hours" (
  "id" UUID NOT NULL,
  "restaurant_id" UUID NOT NULL,
  "weekday" "weekday" NOT NULL,
  "is_open" BOOLEAN NOT NULL DEFAULT false,
  "open_time" TIME(0),
  "close_time" TIME(0),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "opening_hours_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "closed_dates" (
  "id" UUID NOT NULL,
  "restaurant_id" UUID NOT NULL,
  "date" DATE NOT NULL,
  "note" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "closed_dates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "bookings" (
  "id" UUID NOT NULL,
  "restaurant_id" UUID NOT NULL,
  "customer_name" TEXT NOT NULL,
  "customer_email" TEXT NOT NULL,
  "customer_phone" TEXT NOT NULL,
  "guest_count" INTEGER NOT NULL,
  "booking_date" DATE NOT NULL,
  "booking_start_time" TIME(0) NOT NULL,
  "booking_end_time" TIME(0) NOT NULL,
  "status" "booking_status" NOT NULL,
  "source" "booking_source" NOT NULL DEFAULT 'website',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "restaurants_slug_key" ON "restaurants"("slug");
CREATE UNIQUE INDEX "restaurant_settings_restaurant_id_key" ON "restaurant_settings"("restaurant_id");
CREATE UNIQUE INDEX "opening_hours_restaurant_id_weekday_key" ON "opening_hours"("restaurant_id", "weekday");
CREATE UNIQUE INDEX "closed_dates_restaurant_id_date_key" ON "closed_dates"("restaurant_id", "date");

CREATE INDEX "restaurant_settings_restaurant_id_idx" ON "restaurant_settings"("restaurant_id");
CREATE INDEX "opening_hours_restaurant_id_idx" ON "opening_hours"("restaurant_id");
CREATE INDEX "closed_dates_restaurant_id_idx" ON "closed_dates"("restaurant_id");
CREATE INDEX "bookings_restaurant_id_idx" ON "bookings"("restaurant_id");
CREATE INDEX "bookings_restaurant_id_booking_date_status_idx" ON "bookings"("restaurant_id", "booking_date", "status");

ALTER TABLE "restaurant_settings"
  ADD CONSTRAINT "restaurant_settings_restaurant_id_fkey"
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "opening_hours"
  ADD CONSTRAINT "opening_hours_restaurant_id_fkey"
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "closed_dates"
  ADD CONSTRAINT "closed_dates_restaurant_id_fkey"
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_restaurant_id_fkey"
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

COMMENT ON TABLE "opening_hours" IS 'Phase 1 supports only one opening interval per weekday; split lunch/dinner service is not yet supported.';
