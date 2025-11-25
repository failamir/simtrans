import { Location } from '../types';

// Mock data
let mockLocations: Location[] = [
    {
        id: '1',
        name: 'Lahan Pertanian Blok A',
        type: 'Lahan',
        description: 'Lahan pertanian untuk tanaman pangan',
        address: 'Blok A, UPT Rumbiya',
        coordinates: {
            latitude: 0.5,
            longitude: 101.5
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'admin'
    },
    {
        id: '2',
        name: 'Balai Desa Rumbiya',
        type: 'Fasilitas Umum',
        description: 'Pusat kegiatan masyarakat desa',
        address: 'Jl. Utama No. 1, Desa Rumbiya',
        coordinates: {
            latitude: 0.51,
            longitude: 101.51
        },
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        createdBy: 'admin'
    }
];

export const listLocations = async (): Promise<Location[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockLocations];
};

export const getLocation = async (id: string): Promise<Location | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLocations.find(l => l.id === id);
};

export const createLocation = async (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Location> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newLocation: Location = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user'
    };

    mockLocations = [...mockLocations, newLocation];
    return newLocation;
};

export const updateLocation = async (id: string, data: Partial<Location>): Promise<Location> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = mockLocations.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Location not found');

    const updatedLocation = {
        ...mockLocations[index],
        ...data,
        updatedAt: new Date().toISOString()
    };

    mockLocations = [
        ...mockLocations.slice(0, index),
        updatedLocation,
        ...mockLocations.slice(index + 1)
    ];

    return updatedLocation;
};

export const deleteLocation = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockLocations = mockLocations.filter(l => l.id !== id);
};
