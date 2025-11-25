import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Area } from '../../types';
import { listAreas } from '../../services/areas';

interface RegencyFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<void>;
    initialData?: Area;
}

export const RegencyForm: React.FC<RegencyFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        parentId: '',
        population: 0,
        area: 0,
        code: '',
        name: '',
        parentId: '',
        population: 0,
        area: 0,
        isActive: true,
        economicPotential: [] as { sector: string; potential: string; description?: string }[]
    });
    const [provinces, setProvinces] = useState<Area[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);

    useEffect(() => {
        const fetchProvinces = async () => {
            setIsLoadingProvinces(true);
            try {
                const allAreas = await listAreas();
                setProvinces(allAreas.filter(a => a.type === 'province'));
            } catch (error) {
                console.error('Failed to load provinces:', error);
            } finally {
                setIsLoadingProvinces(false);
            }
        };

        if (isOpen) {
            fetchProvinces();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code,
                name: initialData.name,
                parentId: initialData.parentId || '',
                population: initialData.population || 0,
                area: initialData.area || 0,
                population: initialData.population || 0,
                area: initialData.area || 0,
                isActive: initialData.isActive,
                economicPotential: initialData.economicPotential || []
            });
        } else {
            setFormData({
                code: '',
                name: '',
                parentId: '',
                population: 0,
                area: 0,
                population: 0,
                area: 0,
                isActive: true,
                economicPotential: []
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                type: 'city',
                level: 2, // 1=Province, 2=City/Regency
                postalCode: '', // Optional
                coordinates: { latitude: 0, longitude: 0 }, // Default
                economicPotential: formData.economicPotential
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {initialData ? 'Edit Kabupaten' : 'Tambah Kabupaten Baru'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kode Kabupaten
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Contoh: 14.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Kabupaten
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Contoh: Kampar"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Provinsi
                                </label>
                                <select
                                    required
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    disabled={isLoadingProvinces}
                                >
                                    <option value="">Pilih Provinsi</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                                {isLoadingProvinces && <p className="text-xs text-gray-500 mt-1">Memuat data provinsi...</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Populasi
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.population}
                                        onChange={(e) => setFormData({ ...formData, population: parseInt(e.target.value) || 0 })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Luas Wilayah (km²)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>

                            {/* Economic Potential Section */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Potensi Ekonomi
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            economicPotential: [...formData.economicPotential, { sector: '', potential: '', description: '' }]
                                        })}
                                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Tambah Potensi
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.economicPotential.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg relative group">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newPotential = [...formData.economicPotential];
                                                    newPotential.splice(index, 1);
                                                    setFormData({ ...formData, economicPotential: newPotential });
                                                }}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="grid grid-cols-2 gap-3 mb-2">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Sektor (mis: Pertanian)"
                                                        value={item.sector}
                                                        onChange={(e) => {
                                                            const newPotential = [...formData.economicPotential];
                                                            newPotential[index].sector = e.target.value;
                                                            setFormData({ ...formData, economicPotential: newPotential });
                                                        }}
                                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Potensi (mis: Padi)"
                                                        value={item.potential}
                                                        onChange={(e) => {
                                                            const newPotential = [...formData.economicPotential];
                                                            newPotential[index].potential = e.target.value;
                                                            setFormData({ ...formData, economicPotential: newPotential });
                                                        }}
                                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Keterangan (Opsional)"
                                                value={item.description || ''}
                                                onChange={(e) => {
                                                    const newPotential = [...formData.economicPotential];
                                                    newPotential[index].description = e.target.value;
                                                    setFormData({ ...formData, economicPotential: newPotential });
                                                }}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    ))}
                                    {formData.economicPotential.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-2 italic">
                                            Belum ada data potensi ekonomi
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Status Aktif</span>
                                </label>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
