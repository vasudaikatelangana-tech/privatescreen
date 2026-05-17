-- migrations/004_reserve_slot_fn.sql

CREATE OR REPLACE FUNCTION reserve_slot_atomic(
  p_slot_id        UUID,
  p_user_id        UUID,
  p_occasion_type  occasion_type,
  p_guest_count    INT,
  p_special_notes  TEXT DEFAULT NULL,
  p_addons         JSONB DEFAULT '[]'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER   -- runs as the function owner, bypasses RLS for internal ops
AS $$
DECLARE
  v_slot        slots%ROWTYPE;
  v_screen      screens%ROWTYPE;
  v_booking_id  UUID;
  v_total       NUMERIC(10,2) := 0;
  v_addon       JSONB;
BEGIN
  -- 1. Lock the slot row exclusively; NOWAIT raises immediately if another
  --    transaction already holds the lock (concurrent booking attempt)
  SELECT * INTO v_slot
  FROM slots
  WHERE id = p_slot_id
    AND status = 'available'
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'SLOT_UNAVAILABLE'
      USING HINT = 'The requested slot is no longer available';
  END IF;

  -- 2. Fetch screen base price
  SELECT * INTO v_screen
  FROM screens
  WHERE id = v_slot.screen_id AND is_active = TRUE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'SCREEN_INACTIVE'
      USING HINT = 'The screen for this slot is not active';
  END IF;

  v_total := v_screen.base_price;

  -- 3. Sum addon totals
  FOR v_addon IN SELECT * FROM jsonb_array_elements(p_addons)
  LOOP
    v_total := v_total
      + (v_addon->>'unit_price')::NUMERIC
      * (v_addon->>'quantity')::INT;
  END LOOP;

  -- 4. Insert booking
  INSERT INTO bookings (
    user_id, slot_id, occasion_type, guest_count,
    special_notes, total_amount, payment_status, booking_status
  )
  VALUES (
    p_user_id, p_slot_id, p_occasion_type, p_guest_count,
    p_special_notes, v_total, 'pending', 'confirmed'
  )
  RETURNING id INTO v_booking_id;

  -- 5. Insert addon line items
  IF jsonb_array_length(p_addons) > 0 THEN
    INSERT INTO booking_addons (booking_id, addon_id, quantity, unit_price)
    SELECT
      v_booking_id,
      (a->>'addon_id')::UUID,
      (a->>'quantity')::INT,
      (a->>'unit_price')::NUMERIC
    FROM jsonb_array_elements(p_addons) AS a;
  END IF;

  -- 6. Mark slot as booked (atomic with the booking insert)
  UPDATE slots SET status = 'booked' WHERE id = p_slot_id;

  RETURN jsonb_build_object(
    'booking_id',   v_booking_id,
    'total_amount', v_total
  );

EXCEPTION
  WHEN lock_not_available THEN
    RAISE EXCEPTION 'SLOT_LOCKED'
      USING HINT = 'Another user is completing this booking. Please try again.';
END;
$$;