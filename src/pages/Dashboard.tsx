import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { CitizenForm } from '../components/Citizens/CitizenForm';
import { VirtualIDCard } from '../components/Citizens/VirtualIDCard';
import { Users, UserPlus, Activity, Building, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Citizen } from '../types';
import { getDashboardStats, DashboardStats } from '../services/dashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | undefined>();

  // Listen for virtual ID card events from QuickActions
  React.useEffect(() => {
    const handleShowVirtualIDCard = (event: CustomEvent) => {
      setSelectedCitizen(event.detail);
      setShowIDCard(true);
    };

    window.addEventListener('showVirtualIDCard', handleShowVirtualIDCard as EventListener);

    return () => {
      window.removeEventListener('showVirtualIDCard', handleShowVirtualIDCard as EventListener);
    };
  }, []);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  const recentActivities = [
    {
      id: 1,
      action: 'Data keluarga baru ditambahkan (5 anggota)',
      user: 'Staff Admin',
      time: '2 menit yang lalu',
      type: 'success'
    },
    {
      id: 2,
      action: 'Laporan bulanan telah dibuat',
      user: 'Admin Sistem',
      time: '1 jam yang lalu',
      type: 'info'
    },
    {
      id: 3,
      action: 'Data penduduk diperbarui',
      user: 'Staff Admin',
      time: '3 jam yang lalu',
      type: 'warning'
    }
  ];

  const handleAddCitizen = () => {
    setShowForm(true);
  };

  const handleAddCitizens = async (citizensData: Omit<Citizen, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Show success message
    alert(`Berhasil menambahkan ${citizensData.length} data penduduk dari dashboard`);
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-6">
          <h2 className="text-2xl font-bold mb-2">
            Selamat datang, {user?.name}!
          </h2>
          <p className="text-blue-100">
            Kelola data kependudukan dengan mudah dan efisien. Gunakan form dinamis untuk menambah data keluarga sekaligus.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Transmigran"
            value={stats?.totalCitizens || 0}
            icon={Users}
            trend={{ value: 2.5, isPositive: true }}
            color="blue"
          />
          <StatsCard
            title="Total UPT"
            value={stats?.totalUPTs || 0}
            icon={Building}
            trend={{ value: 12, isPositive: true }}
            color="green"
          />
          <StatsCard
            title="Total Lokasi"
            value={stats?.totalLocations || 0}
            icon={Activity}
            trend={{ value: 5, isPositive: true }}
            color="yellow"
          />
          <StatsCard
            title="Total Kawasan"
            value={stats?.totalAreas || 0}
            icon={Building2}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions onAddCitizen={handleAddCitizen} />
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terkini</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">oleh {activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlight */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🚀 Fitur Baru: Pendaftaran Keluarga Dinamis
              </h3>
              <p className="text-gray-600 mb-4">
                Sekarang Anda dapat menambahkan seluruh anggota keluarga dalam satu form yang mudah digunakan.
                Tambah atau hapus anggota keluarga sesuai kebutuhan dengan validasi otomatis.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Form dinamis untuk multiple anggota keluarga</li>
                <li>• Validasi NIK dan data duplikat</li>
                <li>• Hubungan keluarga otomatis</li>
                <li>• Alamat keluarga yang terpusat</li>
              </ul>
            </div>
            <button
              onClick={handleAddCitizen}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Coba Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Citizen Form Modal */}
      <CitizenForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddCitizens}
      />

      {/* Virtual ID Card Modal */}
      {selectedCitizen && (
        <VirtualIDCard
          citizen={selectedCitizen}
          isOpen={showIDCard}
          onClose={() => {
            setShowIDCard(false);
            setSelectedCitizen(undefined);
          }}
        />
      )}
    </Layout>
  );
};