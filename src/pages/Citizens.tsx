import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { CitizenForm } from '../components/Citizens/CitizenForm';
import { Plus, Search, Filter, Edit, Trash2, Eye, Users, Download } from 'lucide-react';
import { Citizen } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Citizens: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCitizen, setEditingCitizen] = useState<Citizen | undefined>();

  // Mock data - in real app, fetch from API
  const [citizens, setCitizens] = useState<Citizen[]>([
    {
      id: '1',
      nik: '3201234567890123',
      name: 'Ahmad Suhendra',
      birthPlace: 'Jakarta',
      birthDate: '1985-05-15',
      gender: 'male',
      address: 'Jl. Sudirman No. 123',
      district: 'Kec. Menteng',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10310',
      phone: '081234567890',
      email: 'ahmad@email.com',
      maritalStatus: 'married',
      religion: 'Islam',
      occupation: 'Pegawai Swasta',
      education: 'S1',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      createdBy: 'admin'
    },
    {
      id: '2',
      nik: '3201234567890124',
      name: 'Siti Nurhaliza',
      birthPlace: 'Bandung',
      birthDate: '1990-08-20',
      gender: 'female',
      address: 'Jl. Asia Afrika No. 456',
      district: 'Kec. Sumur Bandung',
      city: 'Bandung',
      province: 'Jawa Barat',
      postalCode: '40111',
      phone: '081234567891',
      email: 'siti@email.com',
      maritalStatus: 'single',
      religion: 'Islam',
      occupation: 'Guru',
      education: 'S1',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-16',
      createdBy: 'staff'
    }
  ]);

  const filteredCitizens = citizens.filter(citizen =>
    citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citizen.nik.includes(searchTerm) ||
    citizen.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCitizens = async (citizensData: Omit<Citizen, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCitizens = citizensData.map((citizenData, index) => ({
      ...citizenData,
      id: (Date.now() + index).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || 'unknown'
    }));

    setCitizens(prev => [...prev, ...newCitizens]);
    
    // Show success message
    alert(`Berhasil menambahkan ${newCitizens.length} data penduduk`);
  };

  const handleEdit = (citizen: Citizen) => {
    setEditingCitizen(citizen);
    setShowForm(true);
  };

  const handleDelete = (citizenId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setCitizens(prev => prev.filter(c => c.id !== citizenId));
      alert('Data berhasil dihapus');
    }
  };

  const handleView = (citizen: Citizen) => {
    console.log('View citizen:', citizen);
    // Implement view modal or navigate to detail page
  };

  const handleExport = () => {
    // Simulate export functionality
    const csvContent = [
      ['NIK', 'Nama', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin', 'Alamat', 'Kecamatan', 'Kota', 'Provinsi'],
      ...filteredCitizens.map(citizen => [
        citizen.nik,
        citizen.name,
        citizen.birthPlace,
        citizen.birthDate,
        citizen.gender === 'male' ? 'Laki-laki' : 'Perempuan',
        citizen.address,
        citizen.district,
        citizen.city,
        citizen.province
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-penduduk-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Data Penduduk">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIK, atau alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setEditingCitizen(undefined);
                setShowForm(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Keluarga</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Penduduk</p>
                <p className="text-2xl font-bold text-gray-900">{citizens.length.toLocaleString('id-ID')}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Laki-laki</p>
                <p className="text-2xl font-bold text-gray-900">
                  {citizens.filter(c => c.gender === 'male').length.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">♂</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perempuan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {citizens.filter(c => c.gender === 'female').length.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 font-bold">♀</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hasil Pencarian</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCitizens.length.toLocaleString('id-ID')}</p>
              </div>
              <Search className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kecamatan
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option value="">Semua Kecamatan</option>
                  <option value="menteng">Kec. Menteng</option>
                  <option value="sumur-bandung">Kec. Sumur Bandung</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option value="">Semua</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Pernikahan
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option value="">Semua</option>
                  <option value="single">Belum Menikah</option>
                  <option value="married">Menikah</option>
                  <option value="divorced">Cerai</option>
                  <option value="widowed">Janda/Duda</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Citizens Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Pribadi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontak
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
                {filteredCitizens.map((citizen) => (
                  <tr key={citizen.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{citizen.name}</div>
                        <div className="text-sm text-gray-500">NIK: {citizen.nik}</div>
                        <div className="text-sm text-gray-500">
                          {citizen.birthPlace}, {new Date(citizen.birthDate).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{citizen.address}</div>
                      <div className="text-sm text-gray-500">
                        {citizen.district}, {citizen.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{citizen.phone}</div>
                      <div className="text-sm text-gray-500">{citizen.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        citizen.maritalStatus === 'married' 
                          ? 'bg-green-100 text-green-800'
                          : citizen.maritalStatus === 'single'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {citizen.maritalStatus === 'married' ? 'Menikah' :
                         citizen.maritalStatus === 'single' ? 'Belum Menikah' : 
                         citizen.maritalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(citizen)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(citizen)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(citizen.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Menampilkan <span className="font-medium">1</span> sampai{' '}
            <span className="font-medium">{filteredCitizens.length}</span> dari{' '}
            <span className="font-medium">{citizens.length}</span> hasil
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Sebelumnya
            </button>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Citizen Form Modal */}
      <CitizenForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCitizen(undefined);
        }}
        onSubmit={handleAddCitizens}
        editingCitizen={editingCitizen}
      />
    </Layout>
  );
};