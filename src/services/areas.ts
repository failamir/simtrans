import { supabase } from '../lib/supabase';
import { Area } from '../types';

type AreaRow = {
  id: string;
  code: string;
  name: string;
  type: 'province' | 'city' | 'district' | 'village';
  parent_id: string | null;
  level: number;
  is_active: boolean;
  population: number | null;
  area: number | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  economic_potential: any[] | null;
};

function mapRowToArea(row: AreaRow): Area {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    type: row.type,
    parentId: row.parent_id ?? undefined,
    level: row.level,
    isActive: row.is_active,
    population: row.population ?? undefined,
    area: row.area ?? undefined,
    postalCode: row.postal_code ?? undefined,
    coordinates: row.latitude && row.longitude ? {
      latitude: row.latitude,
      longitude: row.longitude,
    } : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by ?? 'unknown',
    economicPotential: row.economic_potential ?? undefined,
  };
}

export async function listAreas(): Promise<Area[]> {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .order('level', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return ((data ?? []) as AreaRow[]).map(mapRowToArea);
}

export async function getArea(id: string): Promise<Area | null> {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToArea(data as AreaRow) : null;
}

export async function createArea(payload: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>, userId: string): Promise<Area> {
  const insertData: any = {
    code: payload.code,
    name: payload.name,
    type: payload.type,
    parent_id: payload.parentId,
    level: payload.level,
    is_active: payload.isActive,
    population: payload.population,
    area: payload.area,
    postal_code: payload.postalCode,
    latitude: payload.coordinates?.latitude,
    longitude: payload.coordinates?.longitude,
    created_by: userId,
    economic_potential: payload.economicPotential,
  };

  const { data, error } = await supabase
    .from('areas')
    .insert(insertData)
    .select('*')
    .single();

  if (error) throw error;
  return mapRowToArea(data as AreaRow);
}

export async function updateArea(id: string, payload: Partial<Area>): Promise<Area> {
  const updateData: any = {};

  if (payload.code) updateData.code = payload.code;
  if (payload.name) updateData.name = payload.name;
  if (payload.type) updateData.type = payload.type;
  if (payload.parentId !== undefined) updateData.parent_id = payload.parentId;
  if (payload.level) updateData.level = payload.level;
  if (payload.isActive !== undefined) updateData.is_active = payload.isActive;
  if (payload.population !== undefined) updateData.population = payload.population;
  if (payload.area !== undefined) updateData.area = payload.area;
  if (payload.postalCode !== undefined) updateData.postal_code = payload.postalCode;
  if (payload.coordinates) {
    updateData.latitude = payload.coordinates.latitude;
    updateData.longitude = payload.coordinates.longitude;
  }
  if (payload.economicPotential) updateData.economic_potential = payload.economicPotential;

  const { data, error } = await supabase
    .from('areas')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return mapRowToArea(data as AreaRow);
}

export async function deleteArea(id: string): Promise<void> {
  const { error } = await supabase
    .from('areas')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
