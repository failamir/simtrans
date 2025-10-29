import { Citizen } from '../types';

const KEY = 'simtrans_citizens';

export function getAllCitizens(): Citizen[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Citizen[]) : [];
  } catch {
    return [];
  }
}

export function saveAllCitizens(list: Citizen[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function upsertCitizens(list: Citizen[]): void {
  const existing = getAllCitizens();
  const byId = new Map(existing.map((c) => [c.id, c] as const));
  list.forEach((c) => byId.set(c.id, c));
  saveAllCitizens(Array.from(byId.values()));
}

export function removeCitizen(id: string): void {
  const next = getAllCitizens().filter((c) => c.id !== id);
  saveAllCitizens(next);
}

export function getCitizenById(id: string): Citizen | undefined {
  return getAllCitizens().find((c) => c.id === id);
}
