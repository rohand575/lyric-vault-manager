-- Create settings table for configurable site information
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'BarryFaberLyrics.com',
  about_text TEXT,
  contact_email TEXT,
  admin_password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create songs table (up to 50 songs)
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  lyrics TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create viewer_passwords table (up to 50 passwords)
CREATE TABLE viewer_passwords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password_value TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create viewer_sessions table to track logins
CREATE TABLE viewer_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_password_id UUID REFERENCES viewer_passwords(id) ON DELETE CASCADE,
  login_at TIMESTAMPTZ DEFAULT now()
);

-- Create song_clicks table for analytics
CREATE TABLE song_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_session_id UUID REFERENCES viewer_sessions(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewer_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_clicks ENABLE ROW LEVEL SECURITY;

-- Public read access for settings (needed for public pages)
CREATE POLICY "Public can read settings" ON settings
  FOR SELECT USING (true);

-- Public read access for active songs
CREATE POLICY "Public can read active songs" ON songs
  FOR SELECT USING (is_active = true);

-- Public read access for viewer_passwords (for login validation)
CREATE POLICY "Public can read viewer passwords" ON viewer_passwords
  FOR SELECT USING (true);

-- Public can create sessions
CREATE POLICY "Public can create sessions" ON viewer_sessions
  FOR INSERT WITH CHECK (true);

-- Public can read sessions
CREATE POLICY "Public can read sessions" ON viewer_sessions
  FOR SELECT USING (true);

-- Public can create song clicks
CREATE POLICY "Public can create song clicks" ON song_clicks
  FOR INSERT WITH CHECK (true);

-- Public can read song clicks
CREATE POLICY "Public can read song clicks" ON song_clicks
  FOR SELECT USING (true);

-- Admin policies - allow all operations on all tables
CREATE POLICY "Admin full access to settings" ON settings
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access to songs" ON songs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access to passwords" ON viewer_passwords
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings with a default admin password (hash of "admin123")
INSERT INTO settings (site_name, about_text, contact_email, admin_password_hash)
VALUES (
  'BarryFaberLyrics.com',
  'Welcome to our lyrics collection.',
  'bfaber@example.com',
  'admin123'
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();