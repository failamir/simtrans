import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { RegencyForm } from '../components/Regencies/RegencyForm';
import {
    Map,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    MapPin,
    Users,
    Maximize
} from 'lucide-react';
import { Area } from '../types';
import { listAreas, deleteArea, createArea, updateArea } from '../services/areas';
import { useAuth } from '../contexts/AuthContext';

export const Regencies: React.FC = () => {
    const { user } = useAuth();
    const [regencies, setRegencies] = useState<Area[]>([]);
    const [provinces, setProvinces] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRegency, setEditingRegency] = useState<Area | undefined>();

    const loadData = async () => {
        setIsLoading(true);
        try {
            const allAreas = await listAreas();
            const cities = allAreas.filter(a => a.type === 'city');
            const provs = allAreas
                .filter(a => a.type === 'province')
                .reduce((acc, curr) => ({ ...acc, [curr.id]: curr.name }), {} as Record<string, string>);

            setRegencies(cities);
            setProvinces(provs);
        } catch (error) {
            console.error('Failed to load areas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
        if (!user) return;
        try {
            await createArea(data, user.id);
            await loadData();
            setShowForm(false);
            alert('Kabupaten berhasil ditambahkan');
        } catch (error) {
            console.error('Failed to create regency:', error);
            alert('Gagal menambahkan kabupaten');
        }
    };

    const handleUpdate = async (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
        if (!editingRegency) return;
        try {
            await updateArea(editingRegency.id, data);
            await loadData();
            setShowForm(false);
            setEditingRegency(undefined);
            alert('Kabupaten berhasil diperbarui');
        } catch (error) {
            console.error('Failed to update regency:', error);
            alert('Gagal memperbarui kabupaten');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kabupaten ini?')) {
            try {
                await deleteArea(id);
                await loadData();
                alert('Kabupaten berhasil dihapus');
            } catch (error) {
                console.error('Failed to delete regency:', error);
                alert('Gagal menghapus kabupaten');
            }
        }
    };

    const filteredRegencies = regencies.filter(regency =>
        regency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        regency.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout title="Data Master - Kabupaten">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari Kabupaten..."
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
                            setEditingRegency(undefined);
                            setShowForm(true);
                        }}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Kabupaten</span>
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Kabupaten</p>
                                <p className="text-2xl font-bold text-gray-900">{regencies.length}</p>
                            </div>
                            <Map className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Populasi</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {regencies.reduce((sum, r) => sum + (r.population || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Luas (km²)</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {regencies.reduce((sum, r) => sum + (r.area || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <Maximize className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Regency Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama Kabupaten
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Provinsi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Populasi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Luas (km²)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Potensi Ekonomi
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : filteredRegencies.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            Tidak ada data kabupaten
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRegencies.map((regency) => (
                                        <tr key={regency.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {regency.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                                    <div className="text-sm text-gray-900">{regency.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {regency.parentId ? provinces[regency.parentId] || '-' : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {regency.population?.toLocaleString() || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {regency.area?.toLocaleString() || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex flex-wrap gap-1">
                                                    {regency.economicPotential && regency.economicPotential.length > 0 ? (
                                                        regency.economicPotential.map((pot, idx) => (
                                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                {pot.sector}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 italic">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingRegency(regency);
                                                            setShowForm(true);
                                                        }}
                                                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(regency.id)}
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

            {/* Regency Form Modal */}
            <RegencyForm
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditingRegency(undefined);
                }}
                onSubmit={editingRegency ? handleUpdate : handleCreate}
                initialData={editingRegency}
            />
        </Layout>
    );
};
