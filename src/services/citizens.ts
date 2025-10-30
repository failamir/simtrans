import { supabase } from '../lib/supabase';
import { Citizen, FamilyMember } from '../types';

type CitizenRow = {
  id: string;
  nik: string;
  name: string;
  birth_place: string;
  birth_date: string;
  gender: 'male' | 'female';
  address: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string | null;
  email: string | null;
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';
  religion: string;
  occupation: string;
  education: string;
  region_kabupaten: string | null;
  region_kawasan: string | null;
  region_upt: string | null;
  region_blok: string | null;
  photo_url: string | null;
  migration_move_date: string | null;
  migration_type: string | null;
  migration_origin_province: string | null;
  migration_origin_regency: string | null;
  migration_origin_district: string | null;
  migration_origin_village: string | null;
  migration_destination_province: string | null;
  migration_destination_regency: string | null;
  migration_destination_district: string | null;
  migration_destination_village: string | null;
  facilities_usaha1_area: string | null;
  facilities_usaha1_coordinates: string | null;
  facilities_usaha1_house_type: string | null;
  facilities_usaha2_area: string | null;
  facilities_usaha2_coordinates: string | null;
  facilities_usaha2_house_type: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

type FamilyMemberRow = {
  id: string;
  citizen_id: string;
  nik: string | null;
  name: string;
  birth_place: string | null;
  birth_date: string | null;
  gender: 'male' | 'female' | null;
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null;
  religion: string | null;
  occupation: string | null;
  education: string | null;
  phone: string | null;
  email: string | null;
  relation_to_head: string;
  created_at: string;
  updated_at: string;
};

function mapRowToCitizen(row: CitizenRow, members?: FamilyMember[]): Citizen {
  return {
    id: row.id,
    nik: row.nik,
    name: row.name,
    birthPlace: row.birth_place,
    birthDate: row.birth_date,
    gender: row.gender,
    address: row.address,
    district: row.district,
    city: row.city,
    province: row.province,
    postalCode: row.postal_code,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    maritalStatus: row.marital_status,
    religion: row.religion,
    occupation: row.occupation,
    education: row.education,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by ?? 'unknown',
    regionKabupaten: row.region_kabupaten ?? undefined,
    regionKawasan: row.region_kawasan ?? undefined,
    regionUPT: row.region_upt ?? undefined,
    regionBlok: row.region_blok ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    familyMembers: members,
    migration: {
      moveDate: row.migration_move_date ?? undefined,
      type: row.migration_type ?? undefined,
      origin: {
        province: row.migration_origin_province ?? undefined,
        regency: row.migration_origin_regency ?? undefined,
        district: row.migration_origin_district ?? undefined,
        village: row.migration_origin_village ?? undefined,
      },
      destination: {
        province: row.migration_destination_province ?? undefined,
        regency: row.migration_destination_regency ?? undefined,
        district: row.migration_destination_district ?? undefined,
        village: row.migration_destination_village ?? undefined,
      },
    },
    facilities: {
      usaha1: {
        area: row.facilities_usaha1_area ?? undefined,
        coordinates: row.facilities_usaha1_coordinates ?? undefined,
        houseType: row.facilities_usaha1_house_type ?? undefined,
      },
      usaha2: {
        area: row.facilities_usaha2_area ?? undefined,
        coordinates: row.facilities_usaha2_coordinates ?? undefined,
        houseType: row.facilities_usaha2_house_type ?? undefined,
      },
    },
  } as Citizen;
}

export async function listCitizens(): Promise<Citizen[]> {
  const { data, error } = await supabase
    .from('citizens')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as CitizenRow[]).map((r: CitizenRow) => mapRowToCitizen(r));
}

export async function getCitizen(id: string): Promise<Citizen | null> {
  const { data, error } = await supabase
    .from('citizens')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  if (!data) return null;

  const { data: members, error: err2 } = await supabase
    .from('family_members')
    .select('*')
    .eq('citizen_id', id)
    .order('created_at', { ascending: true });
  if (err2) throw err2;

  return mapRowToCitizen(
    data as CitizenRow,
    ((members ?? []) as FamilyMemberRow[]).map((m: FamilyMemberRow) => ({
      id: m.id,
      nik: m.nik ?? undefined,
      name: m.name,
      birthPlace: m.birth_place ?? undefined,
      birthDate: m.birth_date ?? undefined,
      gender: m.gender ?? undefined,
      maritalStatus: m.marital_status ?? undefined,
      religion: m.religion ?? undefined,
      occupation: m.occupation ?? undefined,
      education: m.education ?? undefined,
      phone: m.phone ?? undefined,
      email: m.email ?? undefined,
      relationToHead: m.relation_to_head,
    }))
  );
}

export async function createCitizen(payload: Omit<Citizen, 'id' | 'createdAt' | 'updatedAt'>): Promise<Citizen> {
  const { familyMembers, migration, facilities, createdBy, ...base } = payload as any;
  const insertRow: any = {
    nik: base.nik,
    name: base.name,
    birth_place: base.birthPlace,
    birth_date: base.birthDate,
    gender: base.gender,
    address: base.address,
    district: base.district,
    city: base.city,
    province: base.province,
    postal_code: base.postalCode,
    phone: base.phone,
    email: base.email,
    marital_status: base.maritalStatus,
    religion: base.religion,
    occupation: base.occupation,
    education: base.education,
    region_kabupaten: base.regionKabupaten,
    region_kawasan: base.regionKawasan,
    region_upt: base.regionUPT,
    region_blok: base.regionBlok,
    photo_url: base.photoUrl,
    migration_move_date: migration?.moveDate,
    migration_type: migration?.type,
    migration_origin_province: migration?.origin?.province,
    migration_origin_regency: migration?.origin?.regency,
    migration_origin_district: migration?.origin?.district,
    migration_origin_village: migration?.origin?.village,
    migration_destination_province: migration?.destination?.province,
    migration_destination_regency: migration?.destination?.regency,
    migration_destination_district: migration?.destination?.district,
    migration_destination_village: migration?.destination?.village,
    facilities_usaha1_area: facilities?.usaha1?.area,
    facilities_usaha1_coordinates: facilities?.usaha1?.coordinates,
    facilities_usaha1_house_type: facilities?.usaha1?.houseType,
    facilities_usaha2_area: facilities?.usaha2?.area,
    facilities_usaha2_coordinates: facilities?.usaha2?.coordinates,
    facilities_usaha2_house_type: facilities?.usaha2?.houseType,
    created_by: createdBy,
  };

  const { data, error } = await supabase.from('citizens').insert(insertRow).select('*').single();
  if (error) throw error;
  const citizen = mapRowToCitizen(data);

  if (familyMembers && familyMembers.length) {
    const rows = familyMembers.map((m: FamilyMember) => ({
      citizen_id: citizen.id,
      nik: m.nik,
      name: m.name,
      birth_place: m.birthPlace,
      birth_date: m.birthDate,
      gender: m.gender,
      marital_status: m.maritalStatus,
      religion: m.religion,
      occupation: m.occupation,
      education: m.education,
      phone: m.phone,
      email: m.email,
      relation_to_head: m.relationToHead,
    }));
    const { error: err } = await supabase.from('family_members').insert(rows);
    if (err) throw err;
  }

  return citizen;
}

export async function updateCitizen(id: string, payload: Partial<Citizen>): Promise<Citizen> {
  const { familyMembers, migration, facilities, createdBy, ...base } = payload as any;
  const updateRow: any = {
    nik: base.nik,
    name: base.name,
    birth_place: base.birthPlace,
    birth_date: base.birthDate,
    gender: base.gender,
    address: base.address,
    district: base.district,
    city: base.city,
    province: base.province,
    postal_code: base.postalCode,
    phone: base.phone,
    email: base.email,
    marital_status: base.maritalStatus,
    religion: base.religion,
    occupation: base.occupation,
    education: base.education,
    region_kabupaten: base.regionKabupaten,
    region_kawasan: base.regionKawasan,
    region_upt: base.regionUPT,
    region_blok: base.regionBlok,
    photo_url: base.photoUrl,
    migration_move_date: migration?.moveDate,
    migration_type: migration?.type,
    migration_origin_province: migration?.origin?.province,
    migration_origin_regency: migration?.origin?.regency,
    migration_origin_district: migration?.origin?.district,
    migration_origin_village: migration?.origin?.village,
    migration_destination_province: migration?.destination?.province,
    migration_destination_regency: migration?.destination?.regency,
    migration_destination_district: migration?.destination?.district,
    migration_destination_village: migration?.destination?.village,
    facilities_usaha1_area: facilities?.usaha1?.area,
    facilities_usaha1_coordinates: facilities?.usaha1?.coordinates,
    facilities_usaha1_house_type: facilities?.usaha1?.houseType,
    facilities_usaha2_area: facilities?.usaha2?.area,
    facilities_usaha2_coordinates: facilities?.usaha2?.coordinates,
    facilities_usaha2_house_type: facilities?.usaha2?.houseType,
  };

  const { data, error } = await supabase.from('citizens').update(updateRow).eq('id', id).select('*').single();
  if (error) throw error;
  return mapRowToCitizen(data);
}

export async function deleteCitizen(id: string): Promise<void> {
  const { error } = await supabase.from('citizens').delete().eq('id', id);
  if (error) throw error;
}
