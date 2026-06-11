-- Create hotel_room_availability table
-- This table tracks the availability of hotel rooms by date

CREATE TABLE IF NOT EXISTS hotel_room_availability (
  id SERIAL PRIMARY KEY,
  hotel_room_id INTEGER NOT NULL,
  available_date DATE NOT NULL,
  available_rooms INTEGER NOT NULL DEFAULT 0,
  rooms_booked INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked', 'maintenance')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraint to hotel_rooms table
  CONSTRAINT fk_hotel_room_availability_hotel_rooms 
    FOREIGN KEY (hotel_room_id) 
    REFERENCES hotel_rooms(id) 
    ON DELETE CASCADE,
  
  -- Ensure no duplicate entries for same room on same date
  CONSTRAINT unique_room_date 
    UNIQUE(hotel_room_id, available_date)
);

-- Create index for faster queries by hotel_room_id and available_date
CREATE INDEX IF NOT EXISTS idx_hotel_room_availability_room_date 
  ON hotel_room_availability(hotel_room_id, available_date);

CREATE INDEX IF NOT EXISTS idx_hotel_room_availability_booking_date 
  ON hotel_room_availability(available_date);

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_hotel_room_availability_status 
  ON hotel_room_availability(status);
