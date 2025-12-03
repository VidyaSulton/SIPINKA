const { PrismaClient } = require('./generated/prisma');

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
      status: 'APPROVED', // Hanya cek yang sudah approved
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
            useId,
        roomId: parseInt(roomId),
        tanggal: bookingDate,
        jamMulai,
        jamSelesai,
        keterangan,
        status: 'PENDING'
        }, 
    })
    } catch (error) {
        
    }
}