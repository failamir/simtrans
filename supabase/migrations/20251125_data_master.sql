-- Create UPTs table
CREATE TABLE IF NOT EXISTS upts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  regency TEXT NOT NULL,
  province TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  occupied INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'planned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create Locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE upts ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Create policies for UPTs
CREATE POLICY "UPTs are viewable by everyone" 
  ON upts FOR SELECT 
  USING (true);

CREATE POLICY "UPTs are insertable by authenticated users" 
  ON upts FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "UPTs are updatable by authenticated users" 
  ON upts FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "UPTs are deletable by authenticated users" 
  ON upts FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create policies for Locations
CREATE POLICY "Locations are viewable by everyone" 
  ON locations FOR SELECT 
  USING (true);

CREATE POLICY "Locations are insertable by authenticated users" 
  ON locations FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Locations are updatable by authenticated users" 
  ON locations FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Locations are deletable by authenticated users" 
  ON locations FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create updated_at triggers
CREATE TRIGGER handle_updated_at_upts
  BEFORE UPDATE ON upts
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at_locations
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime('updated_at');
