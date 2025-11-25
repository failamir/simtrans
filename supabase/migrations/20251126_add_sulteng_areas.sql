-- Insert Sulawesi Tengah Province
INSERT INTO areas (code, name, type, level, is_active, population, area, latitude, longitude)
VALUES 
('72', 'Sulawesi Tengah', 'province', 1, true, 3000000, 61841.29, -1.4300, 121.4456)
ON CONFLICT (code) DO UPDATE 
SET 
  population = EXCLUDED.population,
  area = EXCLUDED.area,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

-- Get the ID of Sulawesi Tengah
DO $$
DECLARE
  sulteng_id UUID;
BEGIN
  SELECT id INTO sulteng_id FROM areas WHERE code = '72';

  -- Insert Regencies (Kabupaten)
  INSERT INTO areas (code, name, type, parent_id, level, is_active, population, area, latitude, longitude)
  VALUES 
  -- Banggai Laut
  ('72.11', 'Kabupaten Banggai Laut', 'city', sulteng_id, 2, true, 70000, 725.67, -1.5888, 123.5008),
  -- Banggai Kepulauan
  ('72.07', 'Kabupaten Banggai Kepulauan', 'city', sulteng_id, 2, true, 120000, 2488.79, -1.3333, 123.0000),
  -- Buol
  ('72.05', 'Kabupaten Buol', 'city', sulteng_id, 2, true, 150000, 4043.57, 1.0105, 121.3543),
  -- Donggala
  ('72.03', 'Kabupaten Donggala', 'city', sulteng_id, 2, true, 300000, 4275.08, -0.6944, 119.7306),
  -- Morowali
  ('72.06', 'Kabupaten Morowali', 'city', sulteng_id, 2, true, 170000, 3037.04, -2.8000, 121.9000),
  -- Morowali Utara
  ('72.12', 'Kabupaten Morowali Utara', 'city', sulteng_id, 2, true, 130000, 10004.28, -1.7207, 121.2465),
  -- Parigi Moutong
  ('72.08', 'Kabupaten Parigi Moutong', 'city', sulteng_id, 2, true, 450000, 5089.91, 0.3368, 120.1784),
  -- Poso
  ('72.02', 'Kabupaten Poso', 'city', sulteng_id, 2, true, 250000, 7112.25, -1.4000, 120.7500),
  -- Sigi
  ('72.10', 'Kabupaten Sigi', 'city', sulteng_id, 2, true, 260000, 5196.02, -1.3833, 119.9667),
  -- Tolitoli
  ('72.04', 'Kabupaten Tolitoli', 'city', sulteng_id, 2, true, 230000, 4079.77, 1.0000, 120.8000),
  -- Tojo Una-Una
  ('72.09', 'Kabupaten Tojo Una-Una', 'city', sulteng_id, 2, true, 160000, 5721.15, -0.9000, 121.6000)
  ON CONFLICT (code) DO UPDATE 
  SET 
    population = EXCLUDED.population,
    area = EXCLUDED.area,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    parent_id = sulteng_id;
END $$;
