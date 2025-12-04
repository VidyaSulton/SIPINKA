const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

// function untuk mengkonversi waktu dalam format "HH:MM" menjadi menit
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// fungsi untuk memeriksa konflik jadwal
const checkScheduleConflict = async (roomId, tanggal, jamMulai, jamSelesai, excludeBookingId = null) => {
  const bookingDate = new Date(tanggal);
  bookingDate.setHours(0, 0, 0, 0);

  const existingBookings = await prisma.booking.findMany({
    where: {
      roomId: roomId,
      tanggal: bookingDate,
      status: 'Disetujui', // Hanya cek yang sudah disetujui
      ...(excludeBookingId && { id: { not: excludeBookingId } }) // Exclude booking yg sedang di-update
    }
  });
  const newStart = timeToMinutes(jamMulai);
  const newEnd = timeToMinutes(jamSelesai);

  for (const booking of existingBookings) {
    const existingStart = timeToMinutes(booking.jamMulai);
    const existingEnd = timeToMinutes(booking.jamSelesai);

    // Cek overlap: (newStart < existingEnd) && (newEnd > existingStart)
    if (newStart < existingEnd && newEnd > existingStart) {
      return {
        conflict: true,
        booking: booking
      };
    }
  }
  return { conflict : false };
};

// Controller untuk membuat booking baru oleh user
const createBooking = async (req, res) => {
    try {
    const { roomId, tanggal, jamMulai, jamSelesai, keterangan } = req.body;
    const userId = req.user.userId;

    // Validasi input
     if (!roomId || !tanggal || !jamMulai || !jamSelesai || !keterangan) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }
     // Validasi format jam
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(jamMulai) || !timeRegex.test(jamSelesai)) {
      return res.status(400).json({
        success: false,
        message: 'Format jam tidak valid. Gunakan format HH:MM (contoh: 09:00)'
      });
    }

    // Validasi jam mulai < jam selesai
    if (timeToMinutes(jamMulai) >= timeToMinutes(jamSelesai)) {
      return res.status(400).json({
        success: false,
        message: 'Jam mulai harus lebih awal dari jam selesai'
      });
    }

    // cek apakah ruangan tersedia
    const room = await prisma.ruangan.findUnique({
        where: {userId: parseInt(ruanganId)}
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Ruangan tidak ditemukan'
      });
    }

    // Validasi tanggal tidak boleh masa lalu
    const bookingDate = new Date(tanggal);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal peminjaman tidak boleh di masa lalu'
      });
    }

    const jamBukaMinutes = timeToMinutes(room.jamBuka);
    const jamTutupMinutes = timeToMinutes(room.jamTutup);
    const jamMulaiMinutes = timeToMinutes(jamMulai);
    const jamSelesaiMinutes = timeToMinutes(jamSelesai);

    if (jamMulaiMinutes < jamBukaMinutes || jamSelesaiMinutes > jamTutupMinutes) {
      return res.status(400).json({
        success: false,
        message: `Jam peminjaman harus dalam rentang operasional ruangan (${room.jamBuka} - ${room.jamTutup})`
      });
    }

    const conflictCheck = await checkScheduleConflict(
        parseInt(roomId),
        bookingDate,
        jamMulai,
        jamSelesai
        );

    if (conflictCheck.conflict) {
      return res.status(409).json({
        success: false,
        message: 'Jadwal bentrok dengan peminjaman yang sudah disetujui',
        conflictWith: {
          tanggal: conflictCheck.booking.tanggal,
          jamMulai: conflictCheck.booking.jamMulai,
          jamSelesai: conflictCheck.booking.jamSelesai
        }
      });
    }

    const newBooking = await prisma.booking.create({
        data: {
        userId,
        roomId: parseInt(roomId),
        tanggal: bookingDate,
        jamMulai,
        jamSelesai,
        keterangan,
        status: 'Menunggu' // status awal
        }, 
         include: {
        Ruangan: {
          select: {
            RuanganId: true,
            namaRuangan: true,
            kapasitas: true
          }
        },
        user: {
          select: {
            userId: true,
            username: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Peminjaman berhasil dibuat dan menunggu persetujuan",
      data: newBooking
    });

    } catch (error) {
        console.log(error);
        res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengajukan peminjaman',
        error: error.message
     });
    }
};

// Controller untuk mendapatkan daftar booking user saat ini
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
   
    const whereClause = {
      userId: userId
    };

    const bookings = await prisma.peminjaman.findMany({
      where: whereClause,
      include: {
        Ruangan: {
          select: {
            RuanganId: true,
            namaRuangan: true,
            kapasitas: true
          }
        }
      },
      orderBy: [
        { tanggal: 'desc' },
        { jamMulai: 'desc' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Data peminjaman Anda berhasil diambil',
      data: bookings
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data peminjaman',
      error: error.message
    });
  }
};

// Controller untuk mendapatkan daftar pengajuan booking (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.peminjaman.findMany({
      include: {
        User:{
          select: {
            userId: true,
            username: true,
            email: true
          }
        },
        Ruangan:{
          select:{
            ruanganId: true,
            namaRuangan: true,
            kapasitas: true
          }
        }
      },
      orderBy:[
        { status: 'asc' }, // PENDING duluan
        { tanggal: 'desc' },
        { jamMulai: 'desc' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Data semua peminjaman berhasil diambil',
      data: bookings
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data peminjaman',
      error: error.message
    });
  }
};

// Controller untuk public melihat jadwal yang sudah disetujui
const getPublicBookings = async (req, res) => {
  try {
    const { ruanganId, tanggal } = req.query;

    const whereClause = {
      status: "Disetujui"
    };

    if (ruanganId) {
      const date = new Date(tanggal);
      date.setHours(0, 0, 0, 0);
      whereClause.tanggal = date;
    }

    const bookings = await prisma.peminjaman.findMany({
      where: whereClause,
      select:{
        peminjamanId: true,
        tanggal: true,
        jamMulai: true,
        jamSelesai: true,
        keterangan: true,
        Ruangan: {
          select:{
            ruanganId: true,
            namaRuangan: true
          }
        },
        User:{
          select:{
            username: true
          }
        }
      },
      orderBy: [
        { tanggal: 'asc' },
        { jamMulai: 'asc' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Data jadwal peminjaman publik berhasil diambil',
      data: bookings
    });


  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil jadwal',
      error: error.message
    });
  }
};

// Controllers untuk admin menyetujui peminjaman
const approveBooking = async (req, res) => {
  try {
    const { peminjamanId } = req.params;

    const booking = await prisma.peminjaman.findUnique({
      where: { peminjamanId: parseInt(peminjamanId)},
      include: {
        Ruangan: true
      }
    });

    // Cek apakah booking ada
    if (!booking) {
       return res.status(404).json({
        success: false,
        message: 'Peminjaman tidak ditemukan'
      });
    }

    // cek apakah masih menunggu
    if (booking.status !== 'Menunggu') {
      return res.status(400).json({
        success: false,
        message: `Peminjaman sudah ${booking.status === 'APPROVED' ? 'disetujui' : 'ditolak'} sebelumnya`
      });
    }
    // cek konflik jadwal sebelum menyetujui
    const conflictCheck = await checkScheduleConflict(
      booking.ruanganId,
      booking.tanggal,
      booking.jamMulai,
      booking.jamSelesai,
      booking.peminjamanId
    );

    if (conflictCheck.conflict) {
      return res.status(409).json({
        success: false,
        message: 'Tidak bisa disetujui karena bentrok dengan jadwal yang sudah approved',
        conflictWith: conflictCheck.booking
      });
    }

    const approvedBooking = await prisma.peminjaman.update({
      where: { peminjamanId: parseInt(peminjamanId) },
      data: { status: 'Disetujui' },
      include: {
        User:{
          select:{
            userId: true,
            username: true,
            email: true
          }
        },
        Ruangan:{
          select:{
            ruanganId: true,
            namaRuangan: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Peminjaman berhasil disetujui',
      data: approvedBooking
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menyetujui peminjaman',
      error: error.message
    });
  }
};

// Controllers untuk admin menolak peminjaman
const rejectBooking = async (req, res) => {
  try {
    const { peminjamanId } = req.params;

    const booking = await prisma.peminjaman.findUnique({
      where: { peminjamanId: parseInt(peminjamanId)}
    })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Peminjaman tidak ditemukan'
      });
    }

    if (booking.status !== 'Menunggu') {
      return res.status(400).json({
        success: false,
        message: `Peminjaman sudah ${booking.status === 'APPROVED' ? 'disetujui' : 'ditolak'} sebelumnya`
      });
    }

    const rejectedBooking = await prisma.peminjaman.update({
      where: { peminjamanId: parseInt(peminjamanId)},
      data: { status: 'Ditolak' },
      include: {
        User: {
          select: {
            userId: true,
            username: true,
            email: true
          }
        },
        Ruangan: {
          select: {
            ruanganId: true,
            namaRuangan: true,
            kapasitas: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Peminjaman berhasil ditolak',
      data: rejectedBooking
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menolak peminjaman',
      error: error.message
    });
  }
};

// Controllers untuk menghapus peminjaman oleh user
const deleteBooking = async (req, res) => {
  try {
    const { peminjamanId } = req.params;
    const { userId } = req.user.userId;
    const { role } = req.user.role;

    // Cek apakah booking ada
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Peminjaman tidak ditemukan'
      });
    }

    if (role !== 'ADMIN' && booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus peminjaman ini'
      });
    }

    if (booking.status !== 'Menunggu') {
      return res.status(400).json({
        success: false,
        message: 'Hanya peminjaman dengan status Menunggu yang bisa dihapus'
      });
    }

    await prisma.peminjaman.delete({
      where: { peminjamanId: parseInt(peminjamanId)}
    });

    res.status(200).json({
      success: true,
      message: 'Peminjaman berhasil dihapus'
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus peminjaman',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getPublicBookings,
  approveBooking,
  rejectBooking,
  deleteBooking
};