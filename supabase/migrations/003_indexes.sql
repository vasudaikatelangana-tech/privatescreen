-- migrations/003_indexes.sql

-- Availability lookups (the most frequent query)
CREATE INDEX idx_slots_screen_date_status
  ON slots (screen_id, slot_date, status);

-- Admin: all slots for a location on a date
CREATE INDEX idx_slots_date
  ON slots (slot_date);

-- Booking history per user
CREATE INDEX idx_bookings_user
  ON bookings (user_id, booked_at DESC);

-- Payment reconciliation
CREATE INDEX idx_bookings_razorpay
  ON bookings (razorpay_order_id)
  WHERE razorpay_order_id IS NOT NULL;

-- Addon listings per category
CREATE INDEX idx_addons_category
  ON addons (category, is_available);

-- Screens per location
CREATE INDEX idx_screens_location
  ON screens (location_id, is_active);