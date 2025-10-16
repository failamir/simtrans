import React from 'react';
import { Plus, FileText, Download, Search, CreditCard } from 'lucide-react';

interface QuickActionsProps {
  onAddCitizen: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAddCitizen }) => {
  const actions = [
    {
      label: 'Tambah Keluarga',
      icon: Plus,
      onClick: onAddCitizen,
      className: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      label: 'Buat Laporan',
      icon: FileText,
      onClick: () => console.log('Create report'),
      className: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
    },
    {
      label: 'Export Data',
      icon: Download,
      onClick: () => console.log('Export data'),
      className: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
    },
    {
      label: 'Pencarian Lanjut',
      icon: Search,
      onClick: () => console.log('Advanced search'),
      className: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
    },
    {
      label: 'Lihat KTP Sample',
      icon: CreditCard,
      onClick: () => {
        // Sample citizen data for demo
        const sampleCitizen = {
          id: 'sample',
          nik: '3201234567890123',
          name: 'Ahmad Suhendra',
          birthPlace: 'Jakarta',
          birthDate: '1985-05-15',
          gender: 'male' as const,
          address: 'Jl. Sudirman No. 123',
          district: 'Kec. Menteng',
          city: 'Jakarta Pusat',
          province: 'DKI Jakarta',
          postalCode: '10310',
          phone: '081234567890',
          email: 'ahmad@email.com',
          maritalStatus: 'married' as const,
          religion: 'Islam',
          occupation: 'Pegawai Swasta',
          education: 'S1',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15',
          createdBy: 'admin'
        };
        
        // Create and show virtual ID card
        const event = new CustomEvent('showVirtualIDCard', { detail: sampleCitizen });
        window.dispatchEvent(event);
      },
      className: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${action.className}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};