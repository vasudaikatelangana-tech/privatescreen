-- migrations/002_core_tables.sql

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  phone        TEXT UNIQUE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── LOCATIONS ────────────────────────────────────────────────────────────────
CREATE TABLE locations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  city         TEXT NOT NULL,
  address      TEXT NOT NULL,
  latitude     NUMERIC(9, 6),
  longitude    NUMERIC(9, 6),
  image_url    TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── RESTAURANTS ──────────────────────────────────────────────────────────────
CREATE TABLE restaurants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id  UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (location_id)   -- one restaurant per location
);

-- ─── SCREENS ──────────────────────────────────────────────────────────────────
CREATE TABLE screens (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id  UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,                        -- e.g. 'Screen 1 - Luxe'
  type         screen_type NOT NULL,
  capacity     INT NOT NULL CHECK (capacity > 0),
  base_price   NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  amenities    TEXT[],                               -- e.g. '{Dolby,Recliner,PS5}'
  image_url    TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SLOTS ────────────────────────────────────────────────────────────────────
CREATE TABLE slots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screen_id    UUID NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  slot_date    DATE NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  status       slot_status NOT NULL DEFAULT 'available',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Enforce 3-hour duration at the DB level
  CONSTRAINT chk_slot_duration
    CHECK (end_time = start_time + INTERVAL '3 hours'),

  -- No two slots for the same screen can overlap on the same date
  CONSTRAINT uq_screen_slot UNIQUE (screen_id, slot_date, start_time)
);

-- ─── ADDONS ───────────────────────────────────────────────────────────────────
CREATE TABLE addons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  category        addon_category NOT NULL,
  price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url       TEXT,
  is_available    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BOOKINGS ─────────────────────────────────────────────────────────────────
CREATE TABLE bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id),
  slot_id          UUID NOT NULL REFERENCES slots(id),
  occasion_type    occasion_type NOT NULL,
  guest_count      INT NOT NULL CHECK (guest_count > 0),
  special_notes    TEXT,
  total_amount     NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_status   payment_status NOT NULL DEFAULT 'pending',
  booking_status   booking_status NOT NULL DEFAULT 'confirmed',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  booked_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One booking per slot (enforced alongside slot.status = 'booked')
  CONSTRAINT uq_slot_booking UNIQUE (slot_id)
);

-- ─── BOOKING ADDONS ───────────────────────────────────────────────────────────
CREATE TABLE booking_addons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id   UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  addon_id     UUID NOT NULL REFERENCES addons(id),
  quantity     INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price   NUMERIC(10, 2) NOT NULL,   -- snapshot at time of booking
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);