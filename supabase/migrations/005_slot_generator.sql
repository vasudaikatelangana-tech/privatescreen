-- migrations/005_slot_generator.sql

CREATE OR REPLACE FUNCTION generate_slots(
  p_screen_id   UUID,
  p_from_date   DATE,
  p_to_date     DATE,
  p_start_times TIME[]   -- e.g. ARRAY['10:00','13:00','16:00','19:00','22:00']
)
RETURNS INT   -- returns count of slots created
LANGUAGE plpgsql AS $$
DECLARE
  v_date       DATE := p_from_date;
  v_time       TIME;
  v_count      INT := 0;
BEGIN
  WHILE v_date <= p_to_date LOOP
    FOREACH v_time IN ARRAY p_start_times LOOP
      -- Skip if slot already exists (idempotent re-runs)
      INSERT INTO slots (screen_id, slot_date, start_time, end_time, status)
      VALUES (
        p_screen_id,
        v_date,
        v_time,
        v_time + INTERVAL '3 hours',
        'available'
      )
      ON CONFLICT (screen_id, slot_date, start_time) DO NOTHING;

      v_count := v_count + 1;
    END LOOP;
    v_date := v_date + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

-- Usage example:
-- SELECT generate_slots(
--   'your-screen-uuid',
--   CURRENT_DATE,
--   CURRENT_DATE + INTERVAL '30 days',
--   ARRAY['10:00', '13:00', '16:00', '19:00', '22:00']::TIME[]
-- );