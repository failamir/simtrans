import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { LocationForm } from '../components/Locations/LocationForm';
import {
    MapPin,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2
} from 'lucide-react';
import { Location } from '../types';
import { listLocations, deleteLocation, createLocation, updateLocation } from '../services/locations';

export const Locations: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | undefined>();

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await listLocations();
            setLocations(data);
        } catch (error) {
            console.error('Failed to load locations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
        try {
            await createLocation(data);
            await loadData();
            setShowForm(false);
            alert('Lokasi berhasil ditambahkan');
        } catch (error) {
            console.error('Failed to create location:', error);
            alert('Gagal menambahkan lokasi');
        }
    };

    const handleUpdate = async (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
        if (!editingLocation) return;
        try {
            await updateLocation(editingLocation.id, data);
            await loadData();
            setShowForm(false);
            setEditingLocation(undefined);
            alert('Lokasi berhasil diperbarui');
        } catch (error) {
            console.error('Failed to update location:', error);
            alert('Gagal memperbarui lokasi');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
            try {
                await deleteLocation(id);
                await loadData();
                alert('Lokasi berhasil dihapus');
            } catch (error) {
                console.error('Failed to delete location:', error);
                alert('Gagal menghapus lokasi');
            }
        }
    };

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout title="Data Master - Lokasi">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari Lokasi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            setEditingLocation(undefined);
                            setShowForm(true);
                        }}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Lokasi</span>
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Lokasi</p>
                                <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
                            </div>
                            <MapPin className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    {/* Add more stats if needed */}
                </div>

                {/* Location Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama Lokasi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipe
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Alamat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Koordinat
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : filteredLocations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                            Tidak ada data lokasi
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLocations.map((location) => (
                                        <tr key={location.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {location.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {location.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {location.address}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {location.coordinates.latitude}, {location.coordinates.longitude}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingLocation(location);
                                                            setShowForm(true);
                                                        }}
                                                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(location.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Location Form Modal */}
            <LocationForm
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditingLocation(undefined);
                }}
                onSubmit={editingLocation ? handleUpdate : handleCreate}
                initialData={editingLocation}
            />
        </Layout>
    );
};
