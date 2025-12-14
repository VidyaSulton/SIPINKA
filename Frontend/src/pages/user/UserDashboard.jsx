import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building2, 
  Calendar, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileText
} from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3050/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const bookings = data.data;
        
        // Calculate stats
        setStats({
          totalBookings: bookings.length,
          pending: bookings.filter(b => b.status === 'Menunggu').length,
          approved: bookings.filter(b => b.status === 'Disetujui').length,
          rejected: bookings.filter(b => b.status === 'Ditolak').length
        });

        // Get 3 recent bookings
        setRecentBookings(bookings.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Peminjaman',
      value: stats.totalBookings,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Menunggu Persetujuan',
      value: stats.pending,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Disetujui',
      value: stats.approved,
      icon: CheckCircle2,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Ditolak',
      value: stats.rejected,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      Menunggu: { variant: 'secondary', label: 'Menunggu', icon: Clock },
      Disetujui: { variant: 'default', label: 'Disetujui', icon: CheckCircle2, className: 'bg-green-600' },
      Ditolak: { variant: 'destructive', label: 'Ditolak', icon: XCircle }
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status ?? 'Unknown', icon: AlertCircle, className: '' };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </Badge>
    );
  };

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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard <span>{user?.username}</span>
          </h1>
          <p className="text-gray-600">
            Ringkasan aktivitas peminjaman ruangan Anda
          </p>
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
              <CardTitle>Ajukan Peminjaman Baru</CardTitle>
              <CardDescription className="text-blue-100">
                Pilih ruangan dan ajukan peminjaman dengan mudah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/bookings">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 font-medium">
                  Lihat Daftar Ruangan
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <Calendar size={32} className="mb-2" />
              <CardTitle>Lihat Status Peminjaman Saya</CardTitle>
              <CardDescription className="text-indigo-100">
                Cek apakah peminjaman Anda sudah disetujui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/my-bookings">
                <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-medium">
                  Lihat Status Peminjaman
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Peminjaman Terbaru</CardTitle>
                <CardDescription>3 peminjaman terakhir Anda</CardDescription>
              </div>
              <Link to="/dashboard/my-bookings">
                <Button variant="outline" size="sm">
                  Lihat Semua
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Belum ada peminjaman</p>
                <p className="text-sm text-gray-500">
                  Mulai ajukan peminjaman ruangan sekarang!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((Peminjaman) => (
                  <div
                    key={Peminjaman.peminjamanId}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Building2 size={20} className="text-blue-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">
                          {Peminjaman.ruangan.namaRuangan}
                        </h4>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(Peminjaman.tanggal).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {Peminjaman.jamMulai} - {Peminjaman.jamSelesai}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(Peminjaman.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}