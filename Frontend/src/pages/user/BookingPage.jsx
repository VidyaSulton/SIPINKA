import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building2, 
  Users, 
  Clock, 
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function BookingPage() {
  const [ruangan, setRuangan] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    tanggal: '',
    jamMulai: '',
    jamSelesai: '',
    keterangan: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);
 


  // ...existing code...
  useEffect(() => {
    const q = (searchQuery || '').toLowerCase();
    const filtered = ruangan.filter(room => {
     const name = (room.namaRuangan || ruangan.name || '').toLowerCase();
     return name.includes(q);
   });
    setFilteredRooms(filtered);
  }, [searchQuery, ruangan]);


  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:3050/api/rooms');
      const data = await response.json();
      
      if (data.success) {
        setRuangan(data.data);
        setFilteredRooms(data.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    setFormError('');
    setSuccessMessage('');
    setFormData({
      tanggal: '',
      jamMulai: '',
      jamSelesai: '',
      keterangan: ''
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    setFormData({
      tanggal: '',
      jamMulai: '',
      jamSelesai: '',
      keterangan: ''
    });
    setFormError('');
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3050/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ruanganId: selectedRoom.ruanganId,
          tanggal: formData.tanggal,
          jamMulai: formData.jamMulai,
          jamSelesai: formData.jamSelesai,
          keterangan: formData.keterangan
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengajukan peminjaman');
      }

      setSuccessMessage('✅ Peminjaman berhasil diajukan! Menunggu persetujuan admin.');
      
      // Reset form setelah 2 detik
      setTimeout(() => {
        handleCloseModal();
      }, 2000);

    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format (for min date)
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ajukan Peminjaman Ruangan</h1>
            <p className="text-gray-600 mt-1">Pilih ruangan yang ingin Anda pinjam</p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Cari ruangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Room Cards Grid */}
        {filteredRooms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {searchQuery ? 'Tidak ada ruangan yang sesuai dengan pencarian' : 'Belum ada ruangan tersedia'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card 
                key={ruangan.ruanganId} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer"
                onClick={() => handleRoomClick(room)}
              >
                <div className="h-32 bg-gradient-to-br from-blue-900 to-blue-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-2xl truncate">{room.namaRuangan}</h3>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <p className="text-gray-600 font-semibold text-sm line-clamp-2 min-h-10">
                    {room.lokasiRuangan || 'Tidak ada deskripsi'}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users size={18} className="text-blue-700" />
                      <span className="text-sm">
                        Kapasitas: <strong>{room.kapasitas} orang</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={18} className="text-blue-700" />
                      <span className="text-sm">
                        Jam: <strong>{room.jamBuka} - {room.jamTutup}</strong>
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-900 hover:bg-blue-800 mt-4">
                    <Calendar size={18} className="mr-2" />
                    Pilih Ruangan Ini
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Form Peminjaman */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-900">
                Form Peminjaman Ruangan
              </DialogTitle>
              <DialogDescription>
                Isi form di bawah untuk mengajukan peminjaman
              </DialogDescription>
            </DialogHeader>

            {selectedRoom && (
              <div className="space-y-6">
                {/* Room Info */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-blue-900 rounded-lg">
                        <Building2 className="text-white" size={20} />
                      </div>
                      <div className="flex-1"> 
                        <h3 className="font-bold text-lg text-blue-900">{selectedRoom.namaRuangan}</h3>
                        <p className="text-sm text-gray-700 mt-1">{selectedRoom.lokasiRuangan}</p>
                        <div className="flex gap-4 mt-3 text-sm text-gray-700">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            Kapasitas: {selectedRoom.kapasitas} orang
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {selectedRoom.jamBuka} - {selectedRoom.jamTutup}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Success Message */}
                  {successMessage && (
                    <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start gap-3">
                      <CheckCircle2 size={20} className="mt-0.5" />
                      <p className="text-sm">{successMessage}</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {formError && (
                    <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle size={20} className="mt-0.5" />
                      <p className="text-sm">{formError}</p>
                    </div>
                  )}

                  {/* Tanggal */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tanggal Peminjaman *</label>
                    <Input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      min={today}
                      required
                      disabled={formLoading}
                    />
                  </div>

                  {/* Jam Mulai & Jam Selesai */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Jam Mulai *</label>
                      <Input
                        type="time"
                        name="jamMulai"
                        value={formData.jamMulai}
                        onChange={handleInputChange}
                        required
                        disabled={formLoading}
                      />
                      <p className="text-xs text-gray-500">
                        Min: {selectedRoom.jamBuka}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Jam Selesai *</label>
                      <Input
                        type="time"
                        name="jamSelesai"
                        value={formData.jamSelesai}
                        onChange={handleInputChange}
                        required
                        disabled={formLoading}
                      />
                      <p className="text-xs text-gray-500">
                        Max: {selectedRoom.jamTutup}
                      </p>
                    </div>
                  </div>

                  {/* Keterangan */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Keterangan / Keperluan *</label>
                    <textarea
                      name="keterangan"
                      value={formData.keterangan}
                      onChange={handleInputChange}
                      required
                      disabled={formLoading}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Rapat, Seminar, Diklat dll."
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                      disabled={formLoading}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={formLoading}
                      className="flex-1 bg-blue-900 hover:bg-blue-800"
                    >
                      {formLoading ? 'Mengajukan...' : 'Ajukan Peminjaman'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}