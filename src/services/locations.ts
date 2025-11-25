import { supabase } from '../lib/supabase';
import { Location } from '../types';

type LocationRow = {
    id: string;
    name: string;
    type: string;
    description: string | null;
    address: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
    created_by: string | null;
};

function mapRowToLocation(row: LocationRow): Location {
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        description: row.description || '',
        address: row.address,
        coordinates: {
            latitude: row.latitude,
            longitude: row.longitude
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by ?? 'unknown'
    };
}

export const listLocations = async (): Promise<Location[]> => {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapRowToLocation);
};

export const getLocation = async (id: string): Promise<Location | undefined> => {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data ? mapRowToLocation(data) : undefined;
};

export const createLocation = async (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Location> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data: newLocation, error } = await supabase
        .from('locations')
        .insert([{
            name: data.name,
            type: data.type,
            description: data.description,
            address: data.address,
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude,
            created_by: userData.user.id
        }])
        .select()
        .single();

    if (error) throw error;
    return mapRowToLocation(newLocation);
};

export const updateLocation = async (id: string, data: Partial<Location>): Promise<Location> => {
    const updateData: any = { ...data };
    if (data.coordinates) {
        updateData.latitude = data.coordinates.latitude;
        updateData.longitude = data.coordinates.longitude;
        delete updateData.coordinates;
    }

    const { data: updatedLocation, error } = await supabase
        .from('locations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return mapRowToLocation(updatedLocation);
};

export const deleteLocation = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
