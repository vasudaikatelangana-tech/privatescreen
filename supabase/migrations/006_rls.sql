-- migrations/006_rls.sql

ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_addons ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY users_self ON users
  FOR ALL USING (auth.uid() = id);

-- Users can only see their own bookings
CREATE POLICY bookings_owner ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert bookings for themselves
CREATE POLICY bookings_insert ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Booking addons are visible only via their parent booking
CREATE POLICY booking_addons_owner ON booking_addons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_addons.booking_id
        AND bookings.user_id = auth.uid()
    )
  );

-- Public read access for catalogue tables (no auth needed)
CREATE POLICY locations_public ON locations   FOR SELECT USING (is_active = TRUE);
CREATE POLICY screens_public   ON screens     FOR SELECT USING (is_active = TRUE);
CREATE POLICY slots_public     ON slots       FOR SELECT USING (TRUE);
CREATE POLICY addons_public    ON addons      FOR SELECT USING (is_available = TRUE);

ALTER TABLE locations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE screens    ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots      ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons     ENABLE ROW LEVEL SECURITY;