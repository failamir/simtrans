import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Loader } from 'lucide-react';
import { Area } from '../../types';

interface AreaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (areaData: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  editingArea?: Area;
  parentAreas: Area[];
}

export const AreaForm: React.FC<AreaFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingArea,
  parentAreas
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'province' as Area['type'],
    parentId: '',
    level: 1,
    isActive: true,
    population: '',
    area: '',
    postalCode: '',
    latitude: '',
    longitude: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingArea) {
      setFormData({
        code: editingArea.code,
        name: editingArea.name,
        type: editingArea.type,
        parentId: editingArea.parentId || '',
        level: editingArea.level,
        isActive: editingArea.isActive,
        population: editingArea.population?.toString() || '',
        area: editingArea.area?.toString() || '',
        postalCode: editingArea.postalCode || '',
        latitude: editingArea.coordinates?.latitude.toString() || '',
        longitude: editingArea.coordinates?.longitude.toString() || ''
      });
    } else {
      setFormData({
        code: '',
        name: '',
        type: 'province',
        parentId: '',
        level: 1,
        isActive: true,
        population: '',
        area: '',
        postalCode: '',
        latitude: '',
        longitude: ''
      });
    }
  }, [editingArea, isOpen]);

  const areaTypes = [
    { value: 'province', label: 'Provinsi', level: 1 },
    { value: 'city', label: 'Kota/Kabupaten', level: 2 },
    { value: 'district', label: 'Kecamatan', level: 3 },
    { value: 'village', label: 'Kelurahan/Desa', level: 4 }
  ];

  const getAvailableParents = () => {
    const selectedType = areaTypes.find(t => t.value === formData.type);
    if (!selectedType || selectedType.level === 1) return [];
    
    return parentAreas.filter(area => area.level === selectedType.level - 1);
  };

  const handleTypeChange = (type: Area['type']) => {
    const selectedType = areaTypes.find(t => t.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      level: selectedType?.level || 1,
      parentId: selectedType?.level === 1 ? '' : prev.parentId
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) newErrors.code = 'Kode kawasan harus diisi';
    if (!formData.name.trim()) newErrors.name = 'Nama kawasan harus diisi';
    
    if (formData.level > 1 && !formData.parentId) {
      newErrors.parentId = 'Kawasan induk harus dipilih';
    }

    if (formData.population && isNaN(Number(formData.population))) {
      newErrors.population = 'Jumlah penduduk harus berupa angka';
    }

    if (formData.area && isNaN(Number(formData.area))) {
      newErrors.area = 'Luas wilayah harus berupa angka';
    }

    if (formData.latitude && isNaN(Number(formData.latitude))) {
      newErrors.latitude = 'Latitude harus berupa angka';
    }

    if (formData.longitude && isNaN(Number(formData.longitude))) {
      newErrors.longitude = 'Longitude harus berupa angka';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const areaData: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
        code: formData.code,
        name: formData.name,
        type: formData.type,
        parentId: formData.parentId || undefined,
        level: formData.level,
        isActive: formData.isActive,
        population: formData.population ? Number(formData.population) : undefined,
        area: formData.area ? Number(formData.area) : undefined,
        postalCode: formData.postalCode || undefined,
        coordinates: formData.latitude && formData.longitude ? {
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude)
        } : undefined
      };

      await onSubmit(areaData);
      onClose();
      
      // Reset form
      setFormData({
        code: '',
        name: '',
        type: 'province',
        parentId: '',
        level: 1,
        isActive: true,
        population: '',
        area: '',
        postalCode: '',
        latitude: '',
        longitude: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 rounded-t-xl flex-shrink-0">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              {editingArea ? 'Edit Kawasan' : 'Tambah Kawasan'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Kawasan *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                      errors.code ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: 32.01"
                  />
                  {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kawasan *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nama kawasan"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kawasan *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value as Area['type'])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  >
                    {areaTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.level > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kawasan Induk *
                    </label>
                    <select
                      value={formData.parentId}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                        errors.parentId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih kawasan induk</option>
                      {getAvailableParents().map(area => (
                        <option key={area.id} value={area.id}>
                          {area.name} ({area.code})
                        </option>
                      ))}
                    </select>
                    {errors.parentId && <p className="text-red-500 text-sm mt-1">{errors.parentId}</p>}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Penduduk
                  </label>
                  <input
                    type="number"
                    value={formData.population}
                    onChange={(e) => setFormData(prev => ({ ...prev, population: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                      errors.population ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Jumlah penduduk"
                  />
                  {errors.population && <p className="text-red-500 text-sm mt-1">{errors.population}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Luas Wilayah (km²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                      errors.area ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Luas wilayah"
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                    placeholder="Kode pos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              {/* Coordinates */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Koordinat (Opsional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                        errors.latitude ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: -6.2088"
                    />
                    {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                        errors.longitude ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: 106.8456"
                    />
                    {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl flex-shrink-0">
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingArea ? 'Update' : 'Simpan'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};