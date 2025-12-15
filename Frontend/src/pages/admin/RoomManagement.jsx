import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building2, 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  Clock,
  Search,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function RoomManagementPage() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);


    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Form state
  const [formData, setFormData] = useState({
    name: '',
    lokasi: '',
    kapasitas: '',
    jamBuka: '',
    jamTutup: ''
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const filtered = rooms.filter(room =>
      room.namaRuangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.lokasiRuangan?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [searchQuery, rooms]);

  const fetchRooms = async () => {
    try {
        const response = await fetch('http://localhost:3050/api/rooms');
        const data = await response.json();

        if (data.success) {
            setRooms(data.data);
            setFilteredRooms(data.data);
        }
    } catch (error) {
        console.error('Error fetching rooms:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedRoom(null);
    setFormData({
      name: '',
      lokasi: '',
      kapasitas: '',
      jamBuka: '',
      jamTutup: ''
    });
    setFormError('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (room) => {
    setModalMode('edit');
    setSelectedRoom(room);
    setFormData({
      namaRuangan: room.namaRuangan,
      lokasiRuangan: room.lokasiRuangan || '',
      kapasitas: room.kapasitas.toString(),
      jamBuka: room.jamBuka,
      jamTutup: room.jamTutup
    });
    setFormError('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    setFormData({
      name: '',
      lokasi: '',
      kapasitas: '',
      jamBuka: '',
      jamTutup: ''
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
      const url = modalMode === 'create' 
        ? 'http://localhost:3050/api/rooms'
        : `http://localhost:3050/api/rooms/${selectedRoom.ruanganId}`;
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          namaRuangan: formData.namaRuangan,
          lokasiRuangan: formData.lokasiRuangan,
          kapasitas: parseInt(formData.kapasitas),
          jamBuka: formData.jamBuka,
          jamTutup: formData.jamTutup
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Gagal ${modalMode === 'create' ? 'membuat' : 'mengupdate'} ruangan`);
      }

      setSuccessMessage(
        modalMode === 'create' 
          ? '✅ Ruangan berhasil dibuat!' 
          : '✅ Ruangan berhasil diupdate!'
      );
      
      // Refresh data
      fetchRooms();
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 1500);

    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (roomId, roomName) => {
    if (!confirm(`Yakin ingin menghapus ruangan "${roomName}"?\n\nSemua peminjaman terkait juga akan terhapus!`)) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3050/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        fetchRooms();
        alert('✅ Ruangan berhasil dihapus');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('❌ Gagal menghapus ruangan');
    }
  };

  return(
    <AdminLayout>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Ruangan</h1>
            <p className="text-gray-600 mt-1">Kelola data ruangan yang tersedia</p>
          </div>
          
          <Button 
            onClick={handleOpenCreateModal}
            className="bg-blue-900 hover:bg-blue-800 gap-2"
          >
            <Plus size={20} />
            Tambah Ruangan
          </Button>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
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
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="text-blue-700" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Ruangan</p>
                  <p className="text-2xl font-bold">{rooms.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Ruangan ({filteredRooms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {searchQuery ? 'Tidak ada ruangan yang sesuai' : 'Belum ada ruangan'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Nama Ruangan</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Lokasi Ruangan</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Kapasitas</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Jam Operasional</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map((room) => (
                      <tr key={room.ruanganId} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Building2 size={18} className="text-blue-700" />
                            </div>
                            <span className="font-medium">{room.namaRuangan}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {room.lokasiRuangan || '-'}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-gray-700">
                            <Users size={16} />
                            <span>{room.kapasitas} orang</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-gray-700">
                            <Clock size={16} />
                            <span>{room.jamBuka} - {room.jamTutup}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditModal(room)}
                              className="gap-1"
                            >
                              <Pencil size={14} />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(room.ruanganId, room.namaRuangan)}
                              className="gap-1"
                            >
                              <Trash2 size={14} />
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal Form */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-900">
                {modalMode === 'create' ? 'Tambah Ruangan Baru' : 'Edit Ruangan'}
              </DialogTitle>
              <DialogDescription>
                {modalMode === 'create' 
                  ? 'Isi form di bawah untuk menambahkan ruangan baru'
                  : 'Ubah data ruangan sesuai kebutuhan'
                }
              </DialogDescription>
            </DialogHeader>

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

              {/* Nama Ruangan */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Ruangan *</label>
                <Input
                  type="text"
                  name="namaRuangan"
                  value={formData.namaRuangan}
                  onChange={handleInputChange}
                  placeholder="Contoh: Ruang Meeting A"
                  required
                  disabled={formLoading}
                />
              </div>

              {/* Lokasi Ruangan */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Lokasi Ruangan</label>
                <textarea
                  name="lokasiRuangan"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={formLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lokasi tempat dimana ruangan ini berada"
                />
              </div>

              {/* Kapasitas */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Kapasitas (orang) *</label>
                <Input
                  type="number"
                  name="kapasitas"
                  value={formData.kapasitas}
                  onChange={handleInputChange}
                  placeholder="Contoh: 20"
                  min="1"
                  required
                  disabled={formLoading}
                />
              </div>

              {/* Jam Operasional */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jam Buka *</label>
                  <Input
                    type="time"
                    name="jamBuka"
                    value={formData.jamBuka}
                    onChange={handleInputChange}
                    required
                    disabled={formLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Jam Tutup *</label>
                  <Input
                    type="time"
                    name="jamTutup"
                    value={formData.jamTutup}
                    onChange={handleInputChange}
                    required
                    disabled={formLoading}
                  />
                </div>
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
                  {formLoading 
                    ? (modalMode === 'create' ? 'Membuat...' : 'Mengupdate...') 
                    : (modalMode === 'create' ? 'Tambah Ruangan' : 'Update Ruangan')
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}