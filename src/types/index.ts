export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'admin' | 'staff' | 'user';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

export interface Citizen {
  id: string;
  nik: string;
  name: string;
  birthPlace: string;
  birthDate: string;
  gender: 'male' | 'female';
  address: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  phone?: string;
  email?: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  religion: string;
  occupation: string;
  education: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  // Optional fields for scan detail page
  regionKabupaten?: string;
  regionKawasan?: string;
  regionUPT?: string;
  regionBlok?: string;
  photoUrl?: string;
  familyMembers?: FamilyMember[];
  migration?: {
    moveDate?: string;
    type?: 'TRANSMIGRASI UMUM' | 'TRANSMIGRASI SWAKEL';
    origin?: {
      province?: string;
      regency?: string;
      district?: string;
      village?: string;
    };
    destination?: {
      province?: string;
      regency?: string;
      district?: string;
      village?: string;
    };
  };
  facilities?: {
    usaha1?: {
      area?: string;
      coordinates?: string;
      houseType?: string;
    };
    usaha2?: {
      area?: string;
      coordinates?: string;
      houseType?: string;
    };
  };
}

export interface FamilyMember {
  id?: string;
  nik?: string;
  name: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  religion?: string;
  occupation?: string;
  education?: string;
  phone?: string;
  email?: string;
  relationToHead: string; // e.g., Istri, Anak 1, Anak 2
}

export interface Area {
  id: string;
  code: string;
  name: string;
  type: 'province' | 'city' | 'district' | 'village';
  parentId?: string;
  level: number;
  isActive: boolean;
  population?: number;
  area?: number; // in km²
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AreaHierarchy extends Area {
  children?: AreaHierarchy[];
  parent?: Area;
}

export interface DashboardStats {
  totalCitizens: number;
  newRegistrations: number;
  totalUsers: number;
  activeUsers: number;
  genderDistribution: {
    male: number;
    female: number;
  };
  ageGroups: {
    children: number;
    adults: number;
    elderly: number;
  };
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface FilterOptions {
  search: string;
  district: string;
  gender: string;
  maritalStatus: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}