import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { AreaForm } from '../components/Areas/AreaForm';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  ChevronRight,
  ChevronDown,
  Map as MapIcon,
  Users,
  Building,
  TreePine
} from 'lucide-react';
import { Area, AreaHierarchy } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Areas: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | undefined>();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'hierarchy' | 'table'>('hierarchy');

  // Mock data - in real app, fetch from API
  const [areas, setAreas] = useState<Area[]>([
    {
      id: '1',
      code: '32',
      name: 'Jawa Barat',
      type: 'province',
      level: 1,
      isActive: true,
      population: 48037000,
      area: 35377.76,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'admin'
    },
    {
      id: '2',
      code: '32.73',
      name: 'Kota Bandung',
      type: 'city',
      parentId: '1',
      level: 2,
      isActive: true,
      population: 2444160,
      area: 167.31,
      postalCode: '40111',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'admin'
    },
    {
      id: '3',
      code: '32.73.01',
      name: 'Kecamatan Sumur Bandung',
      type: 'district',
      parentId: '2',
      level: 3,
      isActive: true,
      population: 85000,
      area: 8.15,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'admin'
    },
    {
      id: '4',
      code: '32.73.01.001',
      name: 'Kelurahan Braga',
      type: 'village',
      parentId: '3',
      level: 4,
      isActive: true,
      population: 12500,
      area: 1.2,
      postalCode: '40111',
      coordinates: {
        latitude: -6.9175,
        longitude: 107.6191
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'admin'
    },
    {
      id: '5',
      code: '31',
      name: 'DKI Jakarta',
      type: 'province',
      level: 1,
      isActive: true,
      population: 10562088,
      area: 664.01,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'admin'
    },
    {
      id: '6',
      code: '31.71',
      name: 'Jakarta Pusat',
      type: 'city',
      parentId: '5',
      level: 2,
      isActive: true,
      population: 914760,
      area: 48.13,
      postalCode: '10110',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'admin'
    }
  ]);

  const areaTypes = [
    { value: 'all', label: 'Semua Jenis', icon: MapIcon },
    { value: 'province', label: 'Provinsi', icon: Building },
    { value: 'city', label: 'Kota/Kabupaten', icon: Building },
    { value: 'district', label: 'Kecamatan', icon: MapPin },
    { value: 'village', label: 'Kelurahan/Desa', icon: TreePine }
  ];

  const buildHierarchy = (areas: Area[]): AreaHierarchy[] => {
    const areaMap = new Map<string, AreaHierarchy>();
    const roots: AreaHierarchy[] = [];

    // Create map of all areas
    areas.forEach(area => {
      areaMap.set(area.id, { ...area, children: [] });
    });

    // Build hierarchy
    areas.forEach(area => {
      const areaNode = areaMap.get(area.id)!;
      if (area.parentId) {
        const parent = areaMap.get(area.parentId);
        if (parent) {
          parent.children!.push(areaNode);
          areaNode.parent = parent;
        }
      } else {
        roots.push(areaNode);
      }
    });

    return roots;
  };

  const filteredAreas = areas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.code.includes(searchTerm);
    const matchesType = selectedType === 'all' || area.type === selectedType;
    return matchesSearch && matchesType;
  });

  const hierarchy = buildHierarchy(filteredAreas);

  const handleAddArea = async (areaData: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newArea: Area = {
      ...areaData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || 'unknown'
    };

    setAreas(prev => [...prev, newArea]);
    alert('Kawasan berhasil ditambahkan');
  };

  const handleEdit = (area: Area) => {
    setEditingArea(area);
    setShowForm(true);
  };

  const handleDelete = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    const hasChildren = areas.some(a => a.parentId === areaId);
    
    if (hasChildren) {
      alert('Tidak dapat menghapus kawasan yang memiliki sub-kawasan');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus ${area?.name}?`)) {
      setAreas(prev => prev.filter(a => a.id !== areaId));
      alert('Kawasan berhasil dihapus');
    }
  };

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getTypeIcon = (type: Area['type']) => {
    switch (type) {
      case 'province': return Building;
      case 'city': return Building;
      case 'district': return MapPin;
      case 'village': return TreePine;
      default: return MapIcon;
    }
  };

  const getTypeLabel = (type: Area['type']) => {
    switch (type) {
      case 'province': return 'Provinsi';
      case 'city': return 'Kota/Kabupaten';
      case 'district': return 'Kecamatan';
      case 'village': return 'Kelurahan/Desa';
      default: return type;
    }
  };

  const renderHierarchyNode = (node: AreaHierarchy, depth: number = 0) => {
    const Icon = getTypeIcon(node.type);
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className="border-l-2 border-gray-200">
        <div 
          className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100"
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
        >
          <div className="flex items-center space-x-3 flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(node.id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            
            <Icon className="w-5 h-5 text-gray-500" />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{node.name}</span>
                <span className="text-sm text-gray-500">({node.code})</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  node.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {node.isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {getTypeLabel(node.type)}
                {node.population && (
                  <span className="ml-2">• {node.population.toLocaleString('id-ID')} penduduk</span>
                )}
                {node.area && (
                  <span className="ml-2">• {node.area} km²</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => console.log('View area:', node)}
              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(node)}
              className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(node.id)}
              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderHierarchyNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kawasan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Induk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statistik
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
            {filteredAreas.map((area) => {
              const Icon = getTypeIcon(area.type);
              const parent = areas.find(a => a.id === area.parentId);
              
              return (
                <tr key={area.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{area.name}</div>
                        <div className="text-sm text-gray-500">Kode: {area.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{getTypeLabel(area.type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {parent ? parent.name : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {area.population && (
                        <div>{area.population.toLocaleString('id-ID')} penduduk</div>
                      )}
                      {area.area && (
                        <div className="text-gray-500">{area.area} km²</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      area.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {area.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => console.log('View area:', area)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(area)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(area.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Layout title="Manajemen Kawasan">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari kawasan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              {areaTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('hierarchy')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'hierarchy' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Hierarki
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tabel
              </button>
            </div>
            
            <button
              onClick={() => {
                setEditingArea(undefined);
                setShowForm(true);
              }}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kawasan</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kawasan</p>
                <p className="text-2xl font-bold text-gray-900">{areas.length}</p>
              </div>
              <MapIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Provinsi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {areas.filter(a => a.type === 'province').length}
                </p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kota/Kabupaten</p>
                <p className="text-2xl font-bold text-gray-900">
                  {areas.filter(a => a.type === 'city').length}
                </p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Penduduk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {areas.reduce((sum, area) => sum + (area.population || 0), 0).toLocaleString('id-ID')}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'hierarchy' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Hierarki Kawasan</h3>
              <p className="text-sm text-gray-500">Struktur hierarki kawasan administratif</p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {hierarchy.length > 0 ? (
                hierarchy.map(node => renderHierarchyNode(node))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MapIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Tidak ada kawasan yang ditemukan</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          renderTableView()
        )}
      </div>

      {/* Area Form Modal */}
      <AreaForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingArea(undefined);
        }}
        onSubmit={handleAddArea}
        editingArea={editingArea}
        parentAreas={areas}
      />
    </Layout>
  );
};