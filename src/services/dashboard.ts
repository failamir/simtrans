import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalCitizens: number;
  totalAreas: number;
  totalUsers: number;
  totalUPTs: number;
  totalLocations: number;
  recentCitizens: Array<{
    id: string;
    name: string;
    nik: string;
    createdAt: string;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [citizensData, areasData, usersData, uptsData, locationsData] = await Promise.all([
      supabase.from('citizens').select('id, name, nik, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('areas').select('id', { count: 'exact', head: true }).eq('type', 'province'),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('upts').select('id', { count: 'exact', head: true }),
      supabase.from('locations').select('id', { count: 'exact', head: true }),
    ]);

    const totalCitizens = citizensData.data?.length || 0; // This is just recent citizens length, need total count separately if not using count option
    // Actually, for totalCitizens we might want a separate count query or use the count from the response if available.
    // The previous implementation for totalCitizens seems to rely on data.length of the limit(5) query which is wrong for TOTAL.
    // Let's fix totalCitizens count as well.

    const { count: citizenCount } = await supabase.from('citizens').select('id', { count: 'exact', head: true });

    const totalAreas = areasData.count || 0;
    const totalUsers = usersData.count || 0;
    const totalUPTs = uptsData.count || 0;
    const totalLocations = locationsData.count || 0;

    const recentCitizens = (citizensData.data || []).map(citizen => ({
      id: citizen.id,
      name: citizen.name,
      nik: citizen.nik,
      createdAt: citizen.created_at,
    }));

    return {
      totalCitizens: citizenCount || 0,
      totalAreas,
      totalUsers,
      totalUPTs,
      totalLocations,
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
