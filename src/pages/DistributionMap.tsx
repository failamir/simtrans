import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Layout } from '../components/Layout/Layout';
import {
  MapPin,
  Users,
  Filter,
  Layers,
  Download,
  Info,
  Eye,
  EyeOff,
  RotateCcw,
  LogIn
} from 'lucide-react';
import { Area } from '../types';
import 'leaflet/dist/leaflet.css';
import { getMapData, MapData } from '../services/map';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map reset
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

export const DistributionMap: React.FC = () => {
  const { user } = useAuth();
  const [mapData, setMapData] = useState<MapData[]>([]);
  const [selectedArea, setSelectedArea] = useState<MapData | null>(null);
  const [mapType, setMapType] = useState<'population' | 'density'>('population');
  const [showLabels, setShowLabels] = useState(true);
  const [filterLevel, setFilterLevel] = useState<'all' | 'province' | 'city' | 'district' | 'village'>('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-2.5, 118.0]); // Indonesia center
  const [mapZoom, setMapZoom] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMapData();
        setMapData(data);
      } catch (error) {
        console.error('Failed to load map data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredMapData = mapData.filter(data => {
    if (filterLevel === 'all') return true;
    return data.area.type === filterLevel;
  });

  const getMarkerRadius = (value: number, maxValue: number) => {
    const minRadius = 8;
    const maxRadius = 25;
    const ratio = maxValue > 0 ? value / maxValue : 0;
    return minRadius + (maxRadius - minRadius) * ratio;
  };

  const getMarkerColor = (value: number, maxValue: number) => {
    const ratio = maxValue > 0 ? value / maxValue : 0;
    if (ratio > 0.8) return '#ef4444'; // red-500
    if (ratio > 0.6) return '#f97316'; // orange-500
    if (ratio > 0.4) return '#eab308'; // yellow-500
    if (ratio > 0.2) return '#22c55e'; // green-500
    return '#3b82f6'; // blue-500
  };

  const maxPopulation = Math.max(...filteredMapData.map(d => d.population), 0);
  const maxDensity = Math.max(...filteredMapData.map(d => d.density), 0);
  const maxValue = mapType === 'population' ? maxPopulation : maxDensity;

  const handleExportMap = () => {
    const csvContent = [
      ['Kode', 'Nama', 'Jenis', 'Populasi', 'Kepadatan', 'Latitude', 'Longitude'],
      ...filteredMapData.map(data => [
        data.area.code,
        data.area.name,
        data.area.type,
        data.population,
        data.density,
        data.coordinates.latitude,
        data.coordinates.longitude
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peta-penyebaran-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetMapView = () => {
    setMapCenter([-2.5, 118.0]);
    setMapZoom(5);
  };

  const formatValue = (value: number) => {
    if (value > 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value > 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const MapContent = (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-gray-500" />
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value as 'population' | 'density')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="population">Populasi</option>
                <option value="density">Kepadatan</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Semua Level</option>
                <option value="province">Provinsi</option>
                <option value="city">Kota/Kabupaten</option>
                <option value="district">Kecamatan</option>
                <option value="village">Kelurahan/Desa</option>
              </select>
            </div>

            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${showLabels
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
                }`}
            >
              {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Label</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={resetMapView}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset View</span>
            </button>

            <button
              onClick={handleExportMap}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Peta Penyebaran {mapType === 'population' ? 'Populasi' : 'Kepadatan Penduduk'}
              </h3>
              <p className="text-sm text-gray-500">
                Menampilkan {filteredMapData.length} kawasan
              </p>
            </div>

            {/* Leaflet Map */}
            <div className="h-[600px] relative">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <MapController center={mapCenter} zoom={mapZoom} />

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredMapData.map((data) => {
                  const value = mapType === 'population' ? data.population : data.density;
                  const radius = getMarkerRadius(value, maxValue);
                  const color = getMarkerColor(value, maxValue);

                  return (
                    <CircleMarker
                      key={data.area.id}
                      center={[data.coordinates.latitude, data.coordinates.longitude]}
                      radius={radius}
                      fillColor={color}
                      color="white"
                      weight={2}
                      opacity={1}
                      fillOpacity={0.8}
                      eventHandlers={{
                        click: () => setSelectedArea(data)
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-semibold text-gray-900 mb-2">{data.area.name}</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Kode:</span> {data.area.code}</p>
                            <p><span className="font-medium">Jenis:</span> {data.area.type}</p>
                            <p><span className="font-medium">Populasi:</span> {data.population.toLocaleString('id-ID')}</p>
                            <p><span className="font-medium">Kepadatan:</span> {data.density.toLocaleString('id-ID')} per km²</p>
                            {data.area.area && (
                              <p><span className="font-medium">Luas:</span> {data.area.area} km²</p>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-[1000]">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {mapType === 'population' ? 'Populasi' : 'Kepadatan (per km²)'}
                </h4>
                <div className="space-y-2">
                  {[
                    { color: '#ef4444', label: 'Sangat Tinggi', min: 0.8 },
                    { color: '#f97316', label: 'Tinggi', min: 0.6 },
                    { color: '#eab308', label: 'Sedang', min: 0.4 },
                    { color: '#22c55e', label: 'Rendah', min: 0.2 },
                    { color: '#3b82f6', label: 'Sangat Rendah', min: 0 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              Statistik
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Kawasan</p>
                <p className="text-2xl font-bold text-gray-900">{filteredMapData.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Populasi</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredMapData.reduce((sum, data) => sum + data.population, 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rata-rata Kepadatan</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredMapData.length > 0
                    ? Math.round(filteredMapData.reduce((sum, data) => sum + data.density, 0) / filteredMapData.length).toLocaleString('id-ID')
                    : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Area Info */}
          {selectedArea && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-600" />
                Detail Kawasan
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-medium text-gray-900">{selectedArea.area.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kode</p>
                  <p className="font-medium text-gray-900">{selectedArea.area.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jenis</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedArea.area.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Populasi</p>
                  <p className="font-medium text-blue-600">{selectedArea.population.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kepadatan</p>
                  <p className="font-medium text-green-600">{selectedArea.density.toLocaleString('id-ID')} per km²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Luas Wilayah</p>
                  <p className="font-medium text-gray-900">{selectedArea.area.area} km²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Koordinat</p>
                  <p className="font-medium text-gray-900 text-xs">
                    {selectedArea.coordinates.latitude.toFixed(4)}, {selectedArea.coordinates.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedArea(null)}
                className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Top Areas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Top 5 Kawasan
            </h3>
            <div className="space-y-3">
              {filteredMapData
                .sort((a, b) => {
                  const valueA = mapType === 'population' ? a.population : a.density;
                  const valueB = mapType === 'population' ? b.population : b.density;
                  return valueB - valueA;
                })
                .slice(0, 5)
                .map((data, index) => {
                  const value = mapType === 'population' ? data.population : data.density;
                  return (
                    <div
                      key={data.area.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setSelectedArea(data);
                        setMapCenter([data.coordinates.latitude, data.coordinates.longitude]);
                        setMapZoom(8);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{data.area.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{data.area.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 text-sm">
                          {formatValue(value)}
                        </p>
                        {mapType === 'density' && (
                          <p className="text-xs text-gray-500">per km²</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (user) {
    return (
      <Layout title="Peta Penyebaran Penduduk">
        {MapContent}
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SIMTRANS</h1>
          </div>
          <Link
            to="/login"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {MapContent}
      </main>
    </div>
  );
};