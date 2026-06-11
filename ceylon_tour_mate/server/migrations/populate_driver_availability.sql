-- Populate driver_availability table for all active drivers
-- This makes drivers available for bookings

-- Delete existing availability records to start fresh
DELETE FROM driver_availability;

-- Insert availability records for all drivers for next 180 days
-- This covers all future booking requests
INSERT INTO driver_availability (driver_id, available_date, status)
SELECT 
  d.id,
  (CURRENT_DATE + (interval '1 day' * i))::date,
  'available'
FROM driver_details d,
      generate_series(0, 179) AS i
WHERE d.id IS NOT NULL
  AND d.user_id IS NOT NULL
ORDER BY d.id, i;

-- Verify insertion
SELECT 
  COUNT(*) as total_records,
  COUNT(DISTINCT driver_id) as unique_drivers,
  MIN(available_date) as first_date,
  MAX(available_date) as last_date
FROM driver_availability;
