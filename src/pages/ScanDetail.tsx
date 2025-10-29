import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCitizenById } from '../store/citizens';
import { FamilyMember } from '../types';

const Field: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="flex flex-col text-sm">
    <span className="text-gray-600 mb-1 text-xs font-semibold">{label.toUpperCase()}</span>
    <input
      readOnly
      value={(value ?? '').toString()}
      className="border border-gray-300 rounded px-2 py-1 text-gray-800"
    />
  </div>
);

export const ScanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const citizen = id ? getCitizenById(id) : undefined;

  if (!citizen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow p-6 max-w-xl w-full text-center">
          <h1 className="text-lg font-bold mb-2">Data tidak ditemukan</h1>
          <p className="text-gray-600 mb-4">ID: {id}</p>
          <Link to="/" className="text-blue-600 underline">Kembali</Link>
        </div>
      </div>
    );
  }

  const photo = citizen.photoUrl || 'https://via.placeholder.com/900x600?text=Dokumentasi';

  const members: FamilyMember[] = citizen.familyMembers || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#103a5e] text-white text-center py-3 font-bold">SISTEM INFORMASI MANAJEMEN TRANSMIGRASI</div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <Field label="Kabupaten" value={citizen.regionKabupaten || citizen.city} />
          <Field label="Kawasan Transmigrasi" value={citizen.regionKawasan || '-'} />
          <Field label="UPT" value={citizen.regionUPT || '-'} />
          <Field label="Blok" value={citizen.regionBlok || '-'} />
        </div>

        <div className="bg-gray-200 rounded px-4 py-2 font-semibold text-center">DATA IDENTIFIKASI</div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-100 rounded px-3 py-1 text-sm font-semibold inline-block mb-3">DATA PRIBADI</div>
            <div className="space-y-2">
              <Field label="Nama" value={citizen.name} />
              <Field label="Tanggal Lahir" value={new Date(citizen.birthDate).toLocaleDateString('id-ID')} />
              <Field label="Pendidikan" value={citizen.education} />
              <Field label="Pekerjaan" value={citizen.occupation} />
              <Field label="Alamat" value={citizen.address} />
            </div>
          </div>
          <div>
            <div className="bg-gray-100 rounded px-3 py-1 text-sm font-semibold inline-block mb-3">ANGGOTA KELUARGA</div>
            <div className="space-y-2">
              {members.length === 0 ? (
                <p className="text-sm text-gray-600">Belum ada data keluarga</p>
              ) : (
                members.map((m, idx) => (
                  <Field key={idx} label={m.relationToHead} value={m.name} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded px-4 py-2 font-semibold text-center">DOKUMENTASI</div>
        <div>
          <img src={photo} alt="Dokumentasi" className="w-full rounded-md border" />
        </div>

        <div className="bg-gray-200 rounded px-4 py-2 font-semibold text-center">DATA PERPINDAHAN</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="bg-gray-100 rounded px-3 py-1 text-sm font-semibold inline-block">TANGGAL PERPINDAHAN</div>
            <Field label="Tanggal" value={citizen.migration?.moveDate ? new Date(citizen.migration!.moveDate!).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'} />
            <Field label="Jenis" value={citizen.migration?.type || 'TRANSMIGRASI UMUM'} />
          </div>
          <div className="space-y-2">
            <div className="bg-gray-100 rounded px-3 py-1 text-sm font-semibold inline-block">DAERAH ASAL</div>
            <Field label="Provinsi" value={citizen.migration?.origin?.province || '-'} />
            <Field label="Kabupaten" value={citizen.migration?.origin?.regency || '-'} />
            <Field label="Kecamatan" value={citizen.migration?.origin?.district || '-'} />
            <Field label="Kelurahan" value={citizen.migration?.origin?.village || '-'} />
          </div>
          <div className="space-y-2">
            <div className="bg-gray-100 rounded px-3 py-1 text-sm font-semibold inline-block">DAERAH TUJUAN</div>
            <Field label="Provinsi" value={citizen.migration?.destination?.province || '-'} />
            <Field label="Kabupaten" value={citizen.migration?.destination?.regency || '-'} />
            <Field label="Kecamatan" value={citizen.migration?.destination?.district || '-'} />
            <Field label="Kelurahan" value={citizen.migration?.destination?.village || '-'} />
          </div>
        </div>

        <div className="bg-gray-200 rounded px-4 py-2 font-semibold text-center">DATA FASILITAS</div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="bg-gray-100 rounded px-3 py-1 text-sm font-semibold inline-block">LAHAN USAHA 1</div>
            <Field label="Luas" value={citizen.facilities?.usaha1?.area || '-'} />
            <Field label="Lokasi Koordinat" value={citizen.facilities?.usaha1?.coordinates || '-'} />
            <Field label="Rumah" value={citizen.facilities?.usaha1?.houseType || '-'} />
          </div>
          <div className="space-y-2">
            <div className="bg-gray-100 rounded px-3 py-1 text-sm font-semibold inline-block">LAHAN USAHA 2</div>
            <Field label="Luas" value={citizen.facilities?.usaha2?.area || '-'} />
            <Field label="Lokasi Koordinat" value={citizen.facilities?.usaha2?.coordinates || '-'} />
            <Field label="Rumah" value={citizen.facilities?.usaha2?.houseType || '-'} />
          </div>
        </div>

        <div className="sticky bottom-4">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="block text-center bg-blue-600 text-white rounded-full py-3 font-semibold"
          >
            DOWNLOAD
          </a>
        </div>
      </div>
    </div>
  );
};

export default ScanDetail;
