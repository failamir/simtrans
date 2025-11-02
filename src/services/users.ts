import { supabase } from '../lib/supabase';
import { User } from '../types';

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'user';
  avatar: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

function mapRowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    avatar: row.avatar ?? undefined,
    lastLogin: row.last_login ?? undefined,
    createdAt: row.created_at,
  };
}

export async function listUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data ?? []) as UserRow[]).map(mapRowToUser);
}

export async function getUser(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToUser(data as UserRow) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToUser(data as UserRow) : null;
}

export async function createUser(payload: {
  email: string;
  name: string;
  role?: 'admin' | 'staff' | 'user';
}): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: payload.email,
      name: payload.name,
      role: payload.role ?? 'user',
    })
    .select('*')
    .single();

  if (error) throw error;
  return mapRowToUser(data as UserRow);
}

export async function updateUser(id: string, payload: Partial<User>): Promise<User> {
  const updateData: any = {};

  if (payload.name) updateData.name = payload.name;
  if (payload.email) updateData.email = payload.email;
  if (payload.role) updateData.role = payload.role;
  if (payload.avatar) updateData.avatar = payload.avatar;
  if (payload.lastLogin) updateData.last_login = payload.lastLogin;

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return mapRowToUser(data as UserRow);
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateLastLogin(id: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}
