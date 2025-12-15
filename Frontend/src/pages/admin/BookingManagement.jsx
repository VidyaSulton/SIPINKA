import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardCheck,
  Calendar,
  Clock,
  Building2,
  User,
  CheckCircle2,
  XCircle,
  Filter,
  HourglassIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3050/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
        setFilteredBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (peminjamanId) => {
    if (!confirm("Yakin ingin menyetujui peminjaman ini?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3050/api/bookings/${peminjamanId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchBookings();
        alert("✅ Peminjaman berhasil disetujui");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error approving booking:", error);
      alert("❌ Gagal menyetujui peminjaman");
    }
  };

  const handleReject = async (peminjamanId) => {
    if (!confirm("Yakin ingin menolak peminjaman ini?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3050/api/bookings/${peminjamanId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchBookings();
        alert("✅ Peminjaman berhasil ditolak");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("❌ Gagal menolak peminjaman");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Menunggu: {
        variant: "secondary",
        label: "Menunggu",
        icon: HourglassIcon,
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      },
      Disetujui: {
        variant: "default",
        label: "Disetujui",
        icon: CheckCircle2,
        className: "bg-green-100 text-green-800 border-green-300",
      },
      Ditolak: {
        variant: "destructive",
        label: "Ditolak",
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-300",
      },
    };
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        <Icon size={14} className="mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kelola Peminjaman
            </h1>
            <p className="text-gray-600 mt-1">
              Review dan kelola pengajuan peminjaman ruangan
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="Menunggu">Menunggu</SelectItem>
                <SelectItem value="Disetujui">Disetujui</SelectItem>
                <SelectItem value="Ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ClipboardCheck className="text-blue-700" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <HourglassIcon className="text-yellow-700" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b) => b.status === "Menunggu").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="text-green-700" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b) => b.status === "Disetujui").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="text-red-700" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b) => b.status === "Ditolak").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengajuan ({filteredBookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardCheck
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <p className="text-gray-600 mb-2">
                  {statusFilter === "ALL"
                    ? "Belum ada pengajuan peminjaman"
                    : `Tidak ada pengajuan dengan status "${statusFilter}"`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.peminjamanId}
                    className="p-6 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Building2 size={20} className="text-blue-700" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">
                                {booking.ruangan.namaRuangan}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Kapasitas: {booking.ruangan.kapasitas} orang
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-2 text-sm bg-gray-200 p-3 rounded-md">
                          <User size={16} className="text-gray-500" />
                          <span className="font-medium text-gray-700">
                            Peminjam:
                          </span>
                          <span className="text-gray-900">
                            {booking.user.username}
                          </span>
                          <span className="text-gray-500">
                            ({booking.user.email})
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500" />
                            <span>
                              {new Date(booking.tanggal).toLocaleDateString(
                                "id-ID",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-500" />
                            <span>
                              {booking.jamMulai} - {booking.jamSelesai}
                            </span>
                          </div>
                        </div>

                        <div className="bg-blue-100 p-3 rounded-md">
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            Keterangan:
                          </p>
                          <p className="text-sm text-gray-700">
                            {booking.keterangan}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      {booking.status === "Menunggu" && (
                        <div className="flex lg:flex-col gap-2">
                          <Button
                            onClick={() => handleApprove(booking.peminjamanId)}
                            className="gap-2 bg-green-600 hover:bg-green-700 flex-1 lg:flex-none"
                          >
                            <CheckCircle2 size={16} />
                            Setujui
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(booking.peminjamanId)}
                            className="gap-2 flex-1 lg:flex-none"
                          >
                            <XCircle size={16} />
                            Tolak
                          </Button>
                        </div>
                      )}
                      {booking.status !== "Menunggu" && (
                        <div className="lg:w-32 flex items-center justify-center">
                          <p className="text-sm text-gray-500 italic">
                            {booking.status === "Disetujui"
                              ? "Sudah disetujui"
                              : "Sudah ditolak"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
