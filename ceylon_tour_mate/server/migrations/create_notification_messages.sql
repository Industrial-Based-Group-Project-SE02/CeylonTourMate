-- Create notification_messages table to track confirmed trip messages
-- Users can dismiss messages, and dismissed messages won't be shown again

CREATE TABLE IF NOT EXISTS notification_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  booking_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'booking_confirmed',
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_notification_booking FOREIGN KEY (booking_id) REFERENCES booking_form(id) ON DELETE CASCADE,
  
  -- Ensure only one active notification per booking per user
  CONSTRAINT unique_active_notification UNIQUE (user_id, booking_id) WHERE is_dismissed = FALSE
);

-- Create indexes for faster queries
CREATE INDEX idx_notification_user_id ON notification_messages(user_id);
CREATE INDEX idx_notification_booking_id ON notification_messages(booking_id);
CREATE INDEX idx_notification_is_dismissed ON notification_messages(is_dismissed);
CREATE INDEX idx_notification_user_dismissed ON notification_messages(user_id, is_dismissed);
CREATE INDEX idx_notification_created_at ON notification_messages(created_at DESC);
