import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { UPTForm } from '../components/UPT/UPTForm';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MapPin,
  Users,
  Home
} from 'lucide-react';
import { UPT as UPTType } from '../types';
import { listUPTs, deleteUPT, createUPT, updateUPT } from '../services/upt';

export const UPT: React.FC = () => {
  const [upts, setUpts] = useState<UPTType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUPT, setEditingUPT] = useState<UPTType | undefined>();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await listUPTs();
      setUpts(data);
    } catch (error) {
      console.error('Failed to load UPTs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (data: Omit<UPTType, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      await createUPT(data);
      await loadData();
      setShowForm(false);
      alert('UPT berhasil ditambahkan');
    } catch (error) {
      console.error('Failed to create UPT:', error);
      alert('Gagal menambahkan UPT');
    }
  };

  const handleUpdate = async (data: Omit<UPTType, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!editingUPT) return;
    try {
      await updateUPT(editingUPT.id, data);
      await loadData();
      setShowForm(false);
      setEditingUPT(undefined);
      alert('UPT berhasil diperbarui');
    } catch (error) {
      console.error('Failed to update UPT:', error);
      alert('Gagal memperbarui UPT');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus UPT ini?')) {
      try {
        await deleteUPT(id);
        await loadData();
        alert('UPT berhasil dihapus');
      } catch (error) {
        console.error('Failed to delete UPT:', error);
        alert('Gagal menghapus UPT');
      }
    }
  };

  const filteredUPTs = upts.filter(upt =>
    upt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    upt.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    upt.regency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Data Master - UPT">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari UPT..."
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
              setEditingUPT(undefined);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah UPT</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total UPT</p>
                <p className="text-2xl font-bold text-gray-900">{upts.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kapasitas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upts.reduce((sum, upt) => sum + upt.capacity, 0).toLocaleString()}
                </p>
              </div>
              <Home className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terisi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upts.reduce((sum, upt) => sum + upt.occupied, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upts.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* UPT Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama UPT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kapasitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                ) : filteredUPTs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Tidak ada data UPT
                    </td>
                  </tr>
                ) : (
                  filteredUPTs.map((upt) => (
                    <tr key={upt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{upt.name}</div>
                            <div className="text-sm text-gray-500">ID: {upt.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">{upt.location}</div>
                            <div className="text-sm text-gray-500">{upt.regency}, {upt.province}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {upt.occupied} / {upt.capacity} KK
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(upt.occupied / upt.capacity) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${upt.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : upt.status === 'planned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {upt.status === 'active' ? 'Aktif' :
                            upt.status === 'planned' ? 'Rencana' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingUPT(upt);
                              setShowForm(true);
                            }}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(upt.id)}
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

      {/* UPT Form Modal */}
      <UPTForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingUPT(undefined);
        }}
        onSubmit={editingUPT ? handleUpdate : handleCreate}
        initialData={editingUPT}
      />
    </Layout>
  );
};
