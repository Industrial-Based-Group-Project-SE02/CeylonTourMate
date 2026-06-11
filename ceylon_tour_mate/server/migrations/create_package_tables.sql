-- Create package_destinations table
CREATE TABLE IF NOT EXISTS package_destinations (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL,
  destination_code VARCHAR(50),
  destination_name VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  UNIQUE(package_id, destination_code)
);

-- Create package_itinerary_days table
CREATE TABLE IF NOT EXISTS package_itinerary_days (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL,
  day_number INTEGER NOT NULL,
  title VARCHAR(255),
  description TEXT,
  highlights TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  UNIQUE(package_id, day_number)
);

-- Create package_itinerary_activities table
CREATE TABLE IF NOT EXISTS package_itinerary_activities (
  id SERIAL PRIMARY KEY,
  day_id INTEGER NOT NULL,
  time_slot VARCHAR(50),
  activity_type VARCHAR(50),
  activity_name VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(100),
  is_optional BOOLEAN DEFAULT FALSE,
  optional_cost DECIMAL(10, 2) DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (day_id) REFERENCES package_itinerary_days(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_package_destinations_package_id ON package_destinations(package_id);
CREATE INDEX IF NOT EXISTS idx_package_itinerary_days_package_id ON package_itinerary_days(package_id);
CREATE INDEX IF NOT EXISTS idx_package_itinerary_activities_day_id ON package_itinerary_activities(day_id);

-- Verify tables were created
SELECT 
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('package_destinations', 'package_itinerary_days', 'package_itinerary_activities')
ORDER BY tablename;
