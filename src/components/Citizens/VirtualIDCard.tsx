import React from 'react';
import { X, Download, Share2, CreditCard, MapPin, Calendar, User, Phone, Mail, FileImage, FileText } from 'lucide-react';
import { Citizen } from '../../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface VirtualIDCardProps {
  citizen: Citizen;
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualIDCard: React.FC<VirtualIDCardProps> = ({ citizen, isOpen, onClose }) => {
  if (!isOpen) return null;

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getGenderText = (gender: string): string => {
    return gender === 'male' ? 'LAKI-LAKI' : 'PEREMPUAN';
  };

  const getMaritalStatusText = (status: string): string => {
    switch (status) {
      case 'single': return 'BELUM KAWIN';
      case 'married': return 'KAWIN';
      case 'divorced': return 'CERAI HIDUP';
      case 'widowed': return 'CERAI MATI';
      default: return status.toUpperCase();
    }
  };

  const handleDownloadImage = async () => {
    try {
      // Get the ID card element
      const cardElement = document.getElementById('virtual-id-card');
      if (!cardElement) return;

      // Generate canvas from the card element
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight
      });

      // Download as PNG
      const link = document.createElement('a');
      link.download = `KTP_${citizen.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Gagal mengunduh gambar. Silakan coba lagi.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Get the ID card element
      const cardElement = document.getElementById('virtual-id-card');
      if (!cardElement) return;

      // Generate canvas from the card element
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Standard ID card size in mm
      });

      // Calculate dimensions to fit the card properly
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`KTP_${citizen.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal mengunduh PDF. Silakan coba lagi.');
    }
  };

  const handleDownloadCanvas = () => {
    // Create a canvas to generate the ID card as an image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set canvas size (ID card dimensions)
    canvas.width = 800;
    canvas.height = 500;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e40af');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('REPUBLIK INDONESIA', canvas.width / 2, 40);
    
    ctx.font = 'bold 20px Arial';
    ctx.fillText('KARTU TANDA PENDUDUK ELEKTRONIK', canvas.width / 2, 70);

    // Card content background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(40, 100, canvas.width - 80, canvas.height - 140);

    // Content
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';

    const leftColumn = 60;
    const rightColumn = 420;
    let yPos = 140;
    const lineHeight = 30;

    // Left column
    ctx.fillText(`NIK: ${citizen.nik}`, leftColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`Nama: ${citizen.name}`, leftColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`Tempat/Tgl Lahir: ${citizen.birthPlace}, ${formatDate(citizen.birthDate)}`, leftColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`Jenis Kelamin: ${getGenderText(citizen.gender)}`, leftColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`Alamat: ${citizen.address}`, leftColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`RT/RW: -/-`, leftColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`Kel/Desa: ${citizen.district}`, leftColumn, yPos);

    // Right column
    yPos = 140;
    ctx.fillText(`Agama: ${citizen.religion}`, rightColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`Status Perkawinan: ${getMaritalStatusText(citizen.maritalStatus)}`, rightColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`Pekerjaan: ${citizen.occupation}`, rightColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`Kewarganegaraan: WNI`, rightColumn, yPos);
    yPos += lineHeight;
    ctx.fillText(`Berlaku Hingga: SEUMUR HIDUP`, rightColumn, yPos);

    // Footer
    ctx.fillText(`${citizen.city}`, rightColumn, canvas.height - 80);
    ctx.fillText(`${formatDate(citizen.createdAt)}`, rightColumn, canvas.height - 50);

    // Download the image
    const link = document.createElement('a');
    link.download = `KTP_${citizen.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `KTP ${citizen.name}`,
          text: `Kartu Tanda Penduduk - ${citizen.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const cardData = `
KTP ELEKTRONIK
NIK: ${citizen.nik}
Nama: ${citizen.name}
Tempat/Tgl Lahir: ${citizen.birthPlace}, ${formatDate(citizen.birthDate)}
Alamat: ${citizen.address}, ${citizen.district}, ${citizen.city}
      `.trim();
      
      navigator.clipboard.writeText(cardData);
      alert('Data KTP telah disalin ke clipboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Kartu Tanda Penduduk Elektronik</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ID Card */}
        <div className="p-6">
          <div 
            id="virtual-id-card"
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg"
          >
            {/* Card Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg/100px-Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg.png" 
                  alt="Garuda Pancasila" 
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold">REPUBLIK INDONESIA</h3>
                  <p className="text-sm opacity-90">KARTU TANDA PENDUDUK ELEKTRONIK</p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="bg-white bg-opacity-95 rounded-lg p-6 text-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo Placeholder */}
                <div className="flex justify-center md:justify-start">
                  <div className="w-32 h-40 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">NIK</p>
                      <p className="text-lg font-bold text-gray-900">{citizen.nik}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Nama</p>
                      <p className="text-lg font-bold text-gray-900">{citizen.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Tempat/Tgl Lahir</p>
                      <p className="text-sm text-gray-900">{citizen.birthPlace}, {formatDate(citizen.birthDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Jenis Kelamin</p>
                      <p className="text-sm text-gray-900">{getGenderText(citizen.gender)}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-medium text-gray-600 uppercase">Alamat</p>
                      <p className="text-sm text-gray-900">{citizen.address}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">RT/RW</p>
                      <p className="text-sm text-gray-900">-/-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Kel/Desa</p>
                      <p className="text-sm text-gray-900">{citizen.district}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Kecamatan</p>
                      <p className="text-sm text-gray-900">{citizen.district}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Kabupaten/Kota</p>
                      <p className="text-sm text-gray-900">{citizen.city}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Provinsi</p>
                      <p className="text-sm text-gray-900">{citizen.province}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Agama</p>
                      <p className="text-sm text-gray-900">{citizen.religion}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Status Perkawinan</p>
                      <p className="text-sm text-gray-900">{getMaritalStatusText(citizen.maritalStatus)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Pekerjaan</p>
                      <p className="text-sm text-gray-900">{citizen.occupation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Kewarganegaraan</p>
                      <p className="text-sm text-gray-900">WNI</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Berlaku Hingga</p>
                      <p className="text-sm font-bold text-gray-900">SEUMUR HIDUP</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-right">
                  <p className="text-xs text-gray-600">{citizen.city}</p>
                  <p className="text-xs text-gray-600">{formatDate(citizen.createdAt)}</p>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Umur: {calculateAge(citizen.birthDate)} tahun</p>
                  {citizen.phone && (
                    <p className="flex items-center mt-1">
                      <Phone className="w-3 h-3 mr-1" />
                      {citizen.phone}
                    </p>
                  )}
                  {citizen.email && (
                    <p className="flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {citizen.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              Informasi Tambahan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Pendidikan</p>
                <p className="font-medium text-gray-900">{citizen.education}</p>
              </div>
              <div>
                <p className="text-gray-600">Kode Pos</p>
                <p className="font-medium text-gray-900">{citizen.postalCode}</p>
              </div>
              <div>
                <p className="text-gray-600">Terdaftar</p>
                <p className="font-medium text-gray-900">{formatDate(citizen.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </button>
            
            <button
              onClick={handleDownloadImage}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileImage className="w-4 h-4" />
              <span>Save as Image</span>
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};