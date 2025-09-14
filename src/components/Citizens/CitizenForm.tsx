import React, { useState } from 'react';
import { X, Plus, Trash2, Save, User, Users } from 'lucide-react';
import { Citizen } from '../../types';

interface CitizenFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (citizens: Omit<Citizen, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]) => void;
  editingCitizen?: Citizen;
}

interface FamilyMember {
  tempId: string;
  nik: string;
  name: string;
  birthPlace: string;
  birthDate: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  religion: string;
  occupation: string;
  education: string;
  phone: string;
  email: string;
  relationToHead: string;
}

const initialMember: FamilyMember = {
  tempId: '',
  nik: '',
  name: '',
  birthPlace: '',
  birthDate: '',
  gender: 'male',
  maritalStatus: 'single',
  religion: 'Islam',
  occupation: '',
  education: '',
  phone: '',
  email: '',
  relationToHead: 'Kepala Keluarga'
};

export const CitizenForm: React.FC<CitizenFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCitizen
}) => {
  const [familyData, setFamilyData] = useState({
    address: '',
    district: '',
    city: '',
    province: '',
    postalCode: ''
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { ...initialMember, tempId: '1', relationToHead: 'Kepala Keluarga' }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const relationOptions = [
    'Kepala Keluarga',
    'Istri',
    'Suami', 
    'Anak',
    'Menantu',
    'Cucu',
    'Orang Tua',
    'Mertua',
    'Saudara',
    'Lainnya'
  ];

  const religionOptions = [
    'Islam',
    'Kristen',
    'Katolik',
    'Hindu',
    'Buddha',
    'Konghucu',
    'Lainnya'
  ];

  const educationOptions = [
    'Tidak Sekolah',
    'SD',
    'SMP',
    'SMA/SMK',
    'D1',
    'D2',
    'D3',
    'S1',
    'S2',
    'S3'
  ];

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      ...initialMember,
      tempId: Date.now().toString(),
      relationToHead: 'Anak'
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const removeFamilyMember = (tempId: string) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter(member => member.tempId !== tempId));
    }
  };

  const updateFamilyMember = (tempId: string, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(familyMembers.map(member =>
      member.tempId === tempId ? { ...member, [field]: value } : member
    ));
  };

  const updateFamilyData = (field: keyof typeof familyData, value: string) => {
    setFamilyData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate family data
    if (!familyData.address.trim()) newErrors.address = 'Alamat harus diisi';
    if (!familyData.district.trim()) newErrors.district = 'Kecamatan harus diisi';
    if (!familyData.city.trim()) newErrors.city = 'Kota harus diisi';
    if (!familyData.province.trim()) newErrors.province = 'Provinsi harus diisi';
    if (!familyData.postalCode.trim()) newErrors.postalCode = 'Kode pos harus diisi';

    // Validate family members
    familyMembers.forEach((member, index) => {
      if (!member.nik.trim()) newErrors[`member_${index}_nik`] = 'NIK harus diisi';
      if (!member.name.trim()) newErrors[`member_${index}_name`] = 'Nama harus diisi';
      if (!member.birthPlace.trim()) newErrors[`member_${index}_birthPlace`] = 'Tempat lahir harus diisi';
      if (!member.birthDate) newErrors[`member_${index}_birthDate`] = 'Tanggal lahir harus diisi';
      if (!member.occupation.trim()) newErrors[`member_${index}_occupation`] = 'Pekerjaan harus diisi';
      
      // Validate NIK format (16 digits)
      if (member.nik && !/^\d{16}$/.test(member.nik)) {
        newErrors[`member_${index}_nik`] = 'NIK harus 16 digit angka';
      }
    });

    // Check for duplicate NIKs
    const niks = familyMembers.map(m => m.nik).filter(nik => nik.trim());
    const duplicateNiks = niks.filter((nik, index) => niks.indexOf(nik) !== index);
    if (duplicateNiks.length > 0) {
      newErrors.duplicate_nik = 'Terdapat NIK yang sama dalam keluarga';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const citizensData = familyMembers.map(member => ({
        nik: member.nik,
        name: member.name,
        birthPlace: member.birthPlace,
        birthDate: member.birthDate,
        gender: member.gender,
        address: familyData.address,
        district: familyData.district,
        city: familyData.city,
        province: familyData.province,
        postalCode: familyData.postalCode,
        phone: member.phone,
        email: member.email,
        maritalStatus: member.maritalStatus,
        religion: member.religion,
        occupation: member.occupation,
        education: member.education
      }));

      await onSubmit(citizensData);
      onClose();
      
      // Reset form
      setFamilyData({
        address: '',
        district: '',
        city: '',
        province: '',
        postalCode: ''
      });
      setFamilyMembers([{ ...initialMember, tempId: '1', relationToHead: 'Kepala Keluarga' }]);
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              {editingCitizen ? 'Edit Data Penduduk' : 'Tambah Data Keluarga'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Family Address Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Alamat Keluarga
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={familyData.address}
                    onChange={(e) => updateFamilyData('address', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    rows={3}
                    placeholder="Masukkan alamat lengkap"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kecamatan *
                  </label>
                  <input
                    type="text"
                    value={familyData.district}
                    onChange={(e) => updateFamilyData('district', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                      errors.district ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan kecamatan"
                  />
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kota/Kabupaten *
                  </label>
                  <input
                    type="text"
                    value={familyData.city}
                    onChange={(e) => updateFamilyData('city', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan kota/kabupaten"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provinsi *
                  </label>
                  <input
                    type="text"
                    value={familyData.province}
                    onChange={(e) => updateFamilyData('province', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                      errors.province ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan provinsi"
                  />
                  {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Pos *
                  </label>
                  <input
                    type="text"
                    value={familyData.postalCode}
                    onChange={(e) => updateFamilyData('postalCode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                      errors.postalCode ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan kode pos"
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>
              </div>
            </div>

            {/* Family Members Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Anggota Keluarga ({familyMembers.length} orang)
                </h3>
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Anggota</span>
                </button>
              </div>

              {errors.duplicate_nik && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.duplicate_nik}</p>
                </div>
              )}

              <div className="space-y-6">
                {familyMembers.map((member, index) => (
                  <div key={member.tempId} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">
                        Anggota Keluarga #{index + 1}
                        {member.relationToHead && (
                          <span className="ml-2 text-sm text-blue-600">({member.relationToHead})</span>
                        )}
                      </h4>
                      {familyMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(member.tempId)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hubungan dengan Kepala Keluarga *
                        </label>
                        <select
                          value={member.relationToHead}
                          onChange={(e) => updateFamilyMember(member.tempId, 'relationToHead', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        >
                          {relationOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          NIK *
                        </label>
                        <input
                          type="text"
                          value={member.nik}
                          onChange={(e) => updateFamilyMember(member.tempId, 'nik', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                            errors[`member_${index}_nik`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="16 digit NIK"
                          maxLength={16}
                        />
                        {errors[`member_${index}_nik`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`member_${index}_nik`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateFamilyMember(member.tempId, 'name', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                            errors[`member_${index}_name`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Masukkan nama lengkap"
                        />
                        {errors[`member_${index}_name`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`member_${index}_name`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tempat Lahir *
                        </label>
                        <input
                          type="text"
                          value={member.birthPlace}
                          onChange={(e) => updateFamilyMember(member.tempId, 'birthPlace', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                            errors[`member_${index}_birthPlace`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Masukkan tempat lahir"
                        />
                        {errors[`member_${index}_birthPlace`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`member_${index}_birthPlace`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Lahir *
                        </label>
                        <input
                          type="date"
                          value={member.birthDate}
                          onChange={(e) => updateFamilyMember(member.tempId, 'birthDate', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                            errors[`member_${index}_birthDate`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors[`member_${index}_birthDate`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`member_${index}_birthDate`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jenis Kelamin *
                        </label>
                        <select
                          value={member.gender}
                          onChange={(e) => updateFamilyMember(member.tempId, 'gender', e.target.value as 'male' | 'female')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        >
                          <option value="male">Laki-laki</option>
                          <option value="female">Perempuan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status Pernikahan *
                        </label>
                        <select
                          value={member.maritalStatus}
                          onChange={(e) => updateFamilyMember(member.tempId, 'maritalStatus', e.target.value as any)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        >
                          <option value="single">Belum Menikah</option>
                          <option value="married">Menikah</option>
                          <option value="divorced">Cerai</option>
                          <option value="widowed">Janda/Duda</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Agama *
                        </label>
                        <select
                          value={member.religion}
                          onChange={(e) => updateFamilyMember(member.tempId, 'religion', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        >
                          {religionOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pekerjaan *
                        </label>
                        <input
                          type="text"
                          value={member.occupation}
                          onChange={(e) => updateFamilyMember(member.tempId, 'occupation', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                            errors[`member_${index}_occupation`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Masukkan pekerjaan"
                        />
                        {errors[`member_${index}_occupation`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`member_${index}_occupation`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pendidikan *
                        </label>
                        <select
                          value={member.education}
                          onChange={(e) => updateFamilyMember(member.tempId, 'education', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        >
                          {educationOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          No. Telepon
                        </label>
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) => updateFamilyMember(member.tempId, 'phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                          placeholder="Masukkan no. telepon"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateFamilyMember(member.tempId, 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                          placeholder="Masukkan email"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
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
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Data Keluarga</span>
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