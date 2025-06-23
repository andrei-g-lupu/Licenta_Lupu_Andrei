-- Admin Dashboard Database Setup
-- Run this script to create the required tables for admin functionality

-- Add role column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_actions_log table for tracking admin actions
CREATE TABLE IF NOT EXISTS user_actions_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL,
    action_details JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default admin settings
INSERT INTO admin_settings (setting_key, setting_value) VALUES 
    ('site_name', 'Unchiul Steli - Chatbot Fiscal'),
    ('max_queries_per_hour', '100'),
    ('maintenance_mode', 'false'),
    ('ai_model', 'gpt-4o-mini'),
    ('max_response_tokens', '2000')
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_actions_log_user_id ON user_actions_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_log_created_at ON user_actions_log(created_at);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update at least one user to admin role (replace 'your-email@example.com' with your actual email)
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

COMMENT ON TABLE admin_settings IS 'System configuration settings manageable through admin dashboard';
COMMENT ON TABLE user_actions_log IS 'Audit log for tracking admin actions and user activities'; 