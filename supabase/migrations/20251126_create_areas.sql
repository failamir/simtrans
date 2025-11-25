-- Create Areas table
CREATE TABLE IF NOT EXISTS areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('province', 'city', 'district', 'village')),
  parent_id UUID REFERENCES areas(id),
  level INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  population INTEGER,
  area NUMERIC,
  postal_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Areas are viewable by everyone" ON areas FOR SELECT USING (true);
CREATE POLICY "Areas are insertable by authenticated users" ON areas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Areas are updatable by authenticated users" ON areas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Areas are deletable by authenticated users" ON areas FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger for updated_at
-- Note: moddatetime extension must be enabled. It usually is by default or via init.sql
CREATE TRIGGER handle_updated_at_areas
  BEFORE UPDATE ON areas
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime('updated_at');
