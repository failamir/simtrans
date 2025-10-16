import React, { useState } from 'react';
import { X, Share2, CreditCard, MapPin, User, FileImage, FileText, QrCode } from 'lucide-react';
import { Citizen } from '../../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface VirtualIDCardProps {
  citizen: Citizen;
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualIDCard: React.FC<VirtualIDCardProps> = ({ citizen, isOpen, onClose }) => {
  const [showBack, setShowBack] = useState(false);
  
  if (!isOpen) return null;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
            <h2 className="text-xl font-bold text-gray-900">Kartu Identitas Transmigrasi</h2>
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
          {/* Toggle Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowBack(!showBack)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showBack ? 'Lihat Sisi Depan' : 'Lihat Sisi Belakang'}
            </button>
          </div>

          <div 
            id="virtual-id-card"
            className="relative w-full max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden"
            style={{ aspectRatio: '1.6/1' }}
          >
            {/* Front Side */}
            <div 
              className={`absolute inset-0 transition-all duration-500 ${
                showBack ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a7b 100%)'
              }}
            >
              {/* Header */}
              <div className="bg-[#1e3a5f] text-white text-center py-3 px-6">
                <h3 className="text-xs sm:text-sm md:text-base font-bold tracking-wide">DINAS TENAGA KERJA DAN TRANSMIGRASI</h3>
              </div>

              {/* Main Content */}
              <div className="flex items-center justify-center h-[calc(100%-6rem)] p-4 sm:p-6 md:p-8">
                <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-md shadow-lg">
                  {/* Logo */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-600 flex items-center justify-center bg-white shadow-lg">
                        <div className="text-center">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-blue-500 via-blue-600 to-green-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* SIMTRANS Text */}
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">SIMTRANS</h2>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight px-2">
                      SISTEM INFORMASI MANAJEMEN<br />TRANSMIGRASI
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#1e3a5f] text-white text-center py-3 px-6">
                <h3 className="text-xs sm:text-sm md:text-base font-bold tracking-wide">PEMERINTAH PROVINSI SULAWESI TENGAH</h3>
              </div>
            </div>

            {/* Back Side */}
            <div 
              className={`absolute inset-0 transition-all duration-500 ${
                showBack ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a7b 100%)'
              }}
            >
              {/* Header */}
              <div className="text-white text-center py-4 px-6">
                <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-wide mb-1">KARTU IDENTITAS TRANSMIGRASI</h3>
                <div className="flex items-center justify-center">
                  <div className="border-b-2 border-yellow-400 pb-1">
                    <p className="text-yellow-400 text-xs sm:text-sm md:text-base font-bold">UPT. TORIRE</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                <div className="grid grid-cols-3 gap-4">
                  {/* Left Side - Information */}
                  <div className="col-span-2 text-white space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium opacity-90">• NAMA LENGKAP</p>
                      <p className="text-sm sm:text-base md:text-lg font-bold text-yellow-400 ml-3">{citizen.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium opacity-90">• NOMOR (NIK)</p>
                      <p className="text-sm sm:text-base md:text-lg font-bold text-yellow-400 ml-3">{citizen.nik}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium opacity-90">• ASAL DAERAH</p>
                      <p className="text-sm sm:text-base md:text-lg font-bold text-yellow-400 ml-3">{citizen.birthPlace} - {citizen.province}</p>
                    </div>
                  </div>

                  {/* Right Side - QR Code */}
                  <div className="flex flex-col items-center justify-start">
                    <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg">
                      <QrCode className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-800" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-[8px] sm:text-[9px] text-white font-medium">Catatan:</p>
                      <p className="text-[7px] sm:text-[8px] text-white opacity-80 leading-tight">Scan untuk melihat data</p>
                    </div>
                  </div>
                </div>

                {/* Map Background Pattern (Optional decorative element) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="text-white">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
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