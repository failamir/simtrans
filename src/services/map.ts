import { supabase } from '../lib/supabase';
import { Area } from '../types';

export interface MapData {
    area: Area;
    population: number;
    density: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export async function getMapData(): Promise<MapData[]> {
    const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching map data:', error);
        throw error;
    }

    return (data || []).map((area) => ({
        area: {
            id: area.id,
            code: area.code,
            name: area.name,
            type: area.type,
            level: area.level,
            isActive: area.is_active,
            population: area.population || 0,
            area: area.area || 0,
            coordinates: {
                latitude: area.latitude || 0,
                longitude: area.longitude || 0,
            },
            createdAt: area.created_at,
            updatedAt: area.updated_at,
            createdBy: area.created_by,
        },
        population: area.population || 0,
        density: area.area ? Math.round((area.population || 0) / area.area) : 0,
        coordinates: {
            latitude: area.latitude || 0,
            longitude: area.longitude || 0,
        },
    }));
}
