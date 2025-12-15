import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  ClipboardCheck, 
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetchStats();
  }, []);

  const fetchStats= async () => {
    try {
      const token = localStorage.getItem('token');

       // Fetch rooms
      const roomsRes = await fetch('http://localhost:3050/api/rooms');
      const roomsData = await roomsRes.json();


            // Fetch bookings
      const bookingsRes = await fetch('http://localhost:3050/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bookingsData = await  bookingsRes.json();

      if (roomsData.success && bookingsData.success) {
        const bookings = bookingsData.data;

        setStats({
          totalRooms: roomsData.data.length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter(b => b.status === 'Menunggu').length,
          approvedBookings: bookings.filter(b => b.status === 'Disetujui').length
        });
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Ruangan',
      value: stats.totalRooms,
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: "bg-blue-50",
      textColor: 'text-blue-700'
    },
    {
      title: 'Total Peminjaman',
      value: stats.totalBookings,
      icon: ClipboardCheck,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Menunggu Persetujuan',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Disetujui',
      value: stats.approvedBookings,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900'></div>
        </div>
      </AdminLayout>
    );
  }

  return (
     <AdminLayout>
      <div className='space-y-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard Administrator</h1>
          <p className='text-gray-600'>Ringkasan Sistem Peminjaman Ruangan</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={stat.textColor} size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <Building2 size={32} className="mb-2" />
              <CardTitle>Manajemen Ruangan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 mb-4">
                Kelola data ruangan (tambah, edit, hapus)
              </p>
              <a href="/admin/rooms">
                <button className="bg-white text-blue-900 hover:bg-blue-50 font-medium px-6 py-2 rounded-lg transition-colors">
                  Kelola Ruangan →
                </button>
              </a>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <ClipboardCheck size={32} className="mb-2" />
              <CardTitle>Kelola Peminjaman</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-100 mb-4">
                Review dan setujui peminjaman ruangan
              </p>
              <a href="/admin/bookings">
                <button className="bg-white text-indigo-900 hover:bg-indigo-50 font-medium px-6 py-2 rounded-lg transition-colors">
                  Lihat Pengajuan →
                </button>
              </a>
            </CardContent>
          </Card>
          </div>
      </div>
    </AdminLayout>
  );
}