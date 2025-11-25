import { supabase } from '../lib/supabase';
import { UPT } from '../types';

type UPTRow = {
    id: string;
    name: string;
    location: string;
    regency: string;
    province: string;
    capacity: number;
    occupied: number;
    status: 'active' | 'inactive' | 'planned';
    created_at: string;
    updated_at: string;
    created_by: string | null;
};

function mapRowToUPT(row: UPTRow): UPT {
    return {
        id: row.id,
        name: row.name,
        location: row.location,
        regency: row.regency,
        province: row.province,
        capacity: row.capacity,
        occupied: row.occupied,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by ?? 'unknown'
    };
}

export const listUPTs = async (): Promise<UPT[]> => {
    const { data, error } = await supabase
        .from('upts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapRowToUPT);
};

export const getUPT = async (id: string): Promise<UPT | undefined> => {
    const { data, error } = await supabase
        .from('upts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data ? mapRowToUPT(data) : undefined;
};

export const createUPT = async (data: Omit<UPT, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<UPT> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data: newUPT, error } = await supabase
        .from('upts')
        .insert([{
            ...data,
            created_by: userData.user.id
        }])
        .select()
        .single();

    if (error) throw error;
    return mapRowToUPT(newUPT);
};

export const updateUPT = async (id: string, data: Partial<UPT>): Promise<UPT> => {
    const { data: updatedUPT, error } = await supabase
        .from('upts')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return mapRowToUPT(updatedUPT);
};

export const deleteUPT = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('upts')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
