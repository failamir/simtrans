-- Add economic_potential column to areas table
ALTER TABLE areas ADD COLUMN IF NOT EXISTS economic_potential JSONB DEFAULT '[]'::jsonb;

-- Comment on column
COMMENT ON COLUMN areas.economic_potential IS 'List of economic potentials for the area. Structure: [{ sector: string, potential: string, description: string }]';
