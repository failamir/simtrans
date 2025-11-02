import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalCitizens: number;
  totalAreas: number;
  totalUsers: number;
  recentCitizens: Array<{
    id: string;
    name: string;
    nik: string;
    createdAt: string;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [citizensData, areasData, usersData] = await Promise.all([
      supabase.from('citizens').select('id, name, nik, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('areas').select('id').eq('type', 'province'),
      supabase.from('users').select('id'),
    ]);

    const totalCitizens = citizensData.data?.length || 0;
    const totalAreas = areasData.data?.length || 0;
    const totalUsers = usersData.data?.length || 0;

    const recentCitizens = (citizensData.data || []).map(citizen => ({
      id: citizen.id,
      name: citizen.name,
      nik: citizen.nik,
      createdAt: citizen.created_at,
    }));

    return {
      totalCitizens,
      totalAreas,
      totalUsers,
      recentCitizens,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

export async function getCitizensCount(): Promise<number> {
  const { count, error } = await supabase
    .from('citizens')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

export async function getAreasCount(): Promise<number> {
  const { count, error } = await supabase
    .from('areas')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

export async function getUsersCount(): Promise<number> {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}
