import { UPT } from '../types';

// Mock data
let mockUPTs: UPT[] = [
    {
        id: '1',
        name: 'UPT Rumbiya',
        location: 'Desa Rumbiya',
        regency: 'Kab. Kampar',
        province: 'Riau',
        capacity: 500,
        occupied: 350,
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'admin'
    },
    {
        id: '2',
        name: 'UPT Salawati',
        location: 'Distrik Salawati',
        regency: 'Kab. Sorong',
        province: 'Papua Barat Daya',
        capacity: 300,
        occupied: 120,
        status: 'active',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        createdBy: 'admin'
    },
    {
        id: '3',
        name: 'UPT Mahalona',
        location: 'Kec. Towuti',
        regency: 'Kab. Luwu Timur',
        province: 'Sulawesi Selatan',
        capacity: 400,
        occupied: 0,
        status: 'planned',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
        createdBy: 'admin'
    }
];

export const listUPTs = async (): Promise<UPT[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockUPTs];
};

export const getUPT = async (id: string): Promise<UPT | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUPTs.find(u => u.id === id);
};

export const createUPT = async (data: Omit<UPT, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<UPT> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newUPT: UPT = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user' // In real app, get from auth context
    };

    mockUPTs = [...mockUPTs, newUPT];
    return newUPT;
};

export const updateUPT = async (id: string, data: Partial<UPT>): Promise<UPT> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = mockUPTs.findIndex(u => u.id === id);
    if (index === -1) throw new Error('UPT not found');

    const updatedUPT = {
        ...mockUPTs[index],
        ...data,
        updatedAt: new Date().toISOString()
    };

    mockUPTs = [
        ...mockUPTs.slice(0, index),
        updatedUPT,
        ...mockUPTs.slice(index + 1)
    ];

    return updatedUPT;
};

export const deleteUPT = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockUPTs = mockUPTs.filter(u => u.id !== id);
};
