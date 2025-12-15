import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Building2, 
  Users, 
  Clock, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowDown
} from 'lucide-react';
import RoomManagement from "@/assets/RoomManagement.svg";
import RealTimeSchedule from "@/assets/RealTimeSchedule.svg";
import RealibleFeatures from "@/assets/RealibleFeatures.svg";
import OnlineArticle from "@/assets/Online article-cuate.svg";

export default function LandingPage() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [roomsPage, setRoomsPage] = useState(1);
    const [bookingsPage, setBookingsPage] = useState(1);
    const itemsPerPage = 10; // Jumlah item per halaman

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
    try {
      // Fetch rooms
      const roomsRes = await fetch('http://localhost:3050/api/rooms');
      const roomsData = await roomsRes.json();
      
      // Fetch approved bookings
      const bookingsRes = await fetch('http://localhost:3050/api/bookings/public');
      const bookingsData = await bookingsRes.json();
      
      if (roomsData.success) {
        setRooms(roomsData.data);
      }
      
      if (bookingsData.success) {
        setBookings(bookingsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const paginationRooms = () => {
    const startIndex = (roomsPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return rooms.slice(startIndex, endIndex);
  };

  const paginationBookings = () => {
    const startIndex = (bookingsPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return bookings.slice(startIndex, endIndex);
  };

  const totalRoomsPages = Math.ceil(rooms.length / itemsPerPage);
  const totalBookingsPages = Math.ceil(bookings.length / itemsPerPage);

  const scrollToRooms = () => {
    document.getElementById('daftar-ruangan')?.scrollIntoView({ behavior:'smooth' });
  };

  // Fitur Unggulan
  const features = [
    {
      title: 'Booking Mudah & Cepat',
      description: 'Ajukan peminjaman ruangan hanya dalam beberapa klik tanpa ribet',
      icon: '🚀',
      image: RealibleFeatures
    },
    {
      title: 'Approval Real-Time',
      description: 'Dapatkan notifikasi persetujuan langsung dari admin kampus',
      icon: '⚡',
      image: RealTimeSchedule
    },
    {
      title: 'Transparan & Terpercaya',
      description: 'Lihat jadwal ruangan yang tersedia secara real-time dan akurat',
      icon: '✨',
      image: OnlineArticle
    }
  ];

  return(
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg">
                            <Shield className="text-white" size={24} />
                        </div>
                        <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                        SiPinKa
                        </h1>
                        <p className="text-xs text-gray-600">Sistem Informasi Peminjaman Ruangan Kampus</p>
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex gap-3">
                        <Button 
                        variant="outline" 
                        onClick={() => navigate('/login')}
                        className="border-blue-900 text-blue-900 hover:bg-blue-50"
                    >
                        Login
                    </Button>
                    <Button 
                        onClick={() => navigate('/register')}
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        Register
                    </Button>
                    </div>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 lg:px-8 pt-8 lg:pt-12 pb-12 lg:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column */}
                <div className="space-y-6"> 
                    <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100">
                        SiPinKa - Universitas Muhammadiyah Gresik
                    </Badge>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        SiPinKa - Sistem Peminjaman Ruangan Kampus
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Booking ruangan kampus dengan mudah, cepat, dan transparan. Kelola peminjaman ruangan Anda secara efisien dengan sistem yang modern dan user-friendly.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" onClick={scrollToRooms} className="bg-blue-900 hover:bg-blue-800 gap-2">
                            Lihat Ruangan Yang Tersedia
                            <ArrowDown size={20}/>
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="border-blue-900 text-blue-900 hover:bg-blue-50">
                            Ajukan Peminjaman
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 pt-4">
                        <div>
                            <p className="text-3xl font-bold text-blue-900">{rooms.length}</p>
                            <p className="text-sm text-gray-600">Ruangan Yang Tersedia</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-blue-900">{bookings.length}</p>
                            <p className="text-sm text-gray-600">Peminjaman Sedang Berlangsung</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="relative">
                {/* PNG Illustration - center vertically to align with left column */}
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 lg:w-96 lg:h-96 opacity-30 lg:opacity-100">
                    <img src={RoomManagement} alt="illustration" className="w-full h-full object-contain" />
                  </div>
                </div>
            </div>
        </section>

        {/* Fitur Unggulan */}
        <section className="bg-gray-200 py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"> Fitur Unggulan </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Sistem peminjaman ruangan yang dirancang untuk kemudahan dan efisiensi Anda</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6 text-center space-y-4">
                            <div className="w-full h-48 flex items-center justify-center">
                                <img 
                                src={feature.image} 
                                alt={feature.title}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                {feature.description}
                                </p>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                </div>
            </div>
        </section>


        {/* Daftar Ruangan Tersedia */}
      <section id="daftar-ruangan" className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Daftar Ruangan Tersedia
          </h2>
          <p className="text-gray-600">
            Pilih ruangan yang sesuai dengan kebutuhan Anda
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : paginationRooms().length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Belum ada ruangan tersedia</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginationRooms().map((room) => (
                <Card key={room.ruanganId} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Thumbnail Ruangan */}
                  <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 size={64} className="text-white/50" />
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">{room.namaRuangan}</h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                      {room.lokasiRuangan}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={16} className="text-blue-700" />
                        <span>Kapasitas: <strong>{room.kapasitas} orang</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={16} className="text-blue-700" />
                        <span>Jam: <strong>{room.jamBuka} - {room.jamTutup}</strong></span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Ruangan */}
            {totalRoomsPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRoomsPage(prev => Math.max(1, prev - 1))}
                  disabled={roomsPage === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <div className="flex gap-2">
                    {Array.from({ length: totalRoomsPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={roomsPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRoomsPage(page)}
                      className={roomsPage === page ? "bg-blue-900" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRoomsPage(prev => Math.min(totalRoomsPages, prev + 1))}
                  disabled={roomsPage === totalRoomsPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </section>


      {/* Ruangan Yang Sudah Dibooking */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Jadwal Peminjaman Aktif
            </h2>
            <p className="text-gray-600">
              Lihat jadwal ruangan yang sudah dibooking
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : paginationBookings().length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Belum ada jadwal peminjaman</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left p-4 font-semibold text-gray-700">Ruangan</th>
                          <th className="text-left p-4 font-semibold text-gray-700">Tanggal</th>
                          <th className="text-left p-4 font-semibold text-gray-700">Waktu</th>
                          <th className="text-left p-4 font-semibold text-gray-700">Peminjam</th>
                          <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginationBookings().map((booking, index) => (
                          <tr key={booking.peminjamanId} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                  <Building2 size={18} className="text-blue-700" />
                                </div>
                                <span className="font-medium">{booking.ruangan.namaRuangan}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-700">
                              {new Date(booking.tanggal).toLocaleDateString('id-ID', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1 text-gray-700">
                                <Clock size={14} />
                                <span>{booking.jamMulai} - {booking.jamSelesai}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-700">
                              {booking.user.username}
                            </td>
                            <td className="p-4 text-center">
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                <CheckCircle2 size={12} className="mr-1" />
                                Disetujui
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination Bookings */}
              {totalBookingsPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBookingsPage(prev => Math.max(1, prev - 1))}
                    disabled={bookingsPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalBookingsPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={bookingsPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBookingsPage(page)}
                        className={bookingsPage === page ? "bg-blue-900" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBookingsPage(prev => Math.min(totalBookingsPages, prev + 1))}
                    disabled={bookingsPage === totalBookingsPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>


    {/* CTA Section */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
            <img 
              src="https://illustrations.popsy.co/amber/abstract-2.svg" 
              alt="decoration"
              className="w-full h-full object-contain"
            />
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ingin Meminjam Ruangan?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Daftar sekarang dan mulai booking ruangan kampus dengan mudah dan cepat
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/login')}
                className="bg-white text-blue-900 hover:bg-blue-50"
              >
                Daftar Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

 {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-700 rounded-lg">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">SiPinKa</h3>
                <p className="text-sm">Sistem Peminjaman Kampus</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a 
                href="https://fb.com/groups/programmerhandal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com/vdysltn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="mailto:umg.ac.id"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2024 SiPinKa - Sistem Peminjaman Ruangan Kampus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}