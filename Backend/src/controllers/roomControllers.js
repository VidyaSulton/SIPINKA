const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

const getAllRooms = async (req, res) => {
    try {
        const rooms = await prisma.ruangan.findFirst({
            orderBy: { name: 'asc'} // Mengurutkan berdasarkan nama ruangan secara ascending
        });

        res.status(200).json({
            success: true,
            message: "Data semua ruangan berhasil diambil",
            data: rooms
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data ruangan",
            error: error.message
        });
    }
};

const getRoomsById = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await prisma.ruangan.findUnique({
            where: {id: parseInt(id)}
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Ruangan tidak ditemukan"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Data ruangan berhasil diambil",
            data: room
        })
    } catch (error) {
        console.error(error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil detail ruangan',
      error: error.message
    });
    }
}

const createRoom = async (req, res) => {
    try {
        const { namaRuangan, lokasiRuangan, kapasitas, jamBuka, jamTutup } = req.body;

        if (!namaRuangan || !lokasiRuangan || !kapasitas || !jamBuka || !jamTutup) {
             return res.status(400).json({
                success: false,
                message: "Semua field harus diisi"
             });
        }

        // Validasi kapasitas harus angka positif
        if (capacity < 1) {
            return res.status(400).json({
            success: false,
            message: 'Kapasitas minimal 1 orang'
             });
        }        

        // Validasi format jam (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(jamBuka) || !timeRegex.test(jamTutup)) {
            return res.status(400).json({
            success: false,
            message: 'Format jam harus HH:MM (contoh: 08:00)'
            });
        }

        if (jamBuka >= jamTutup) {
            return res.status(400).json({
            success: false,
            message: 'Jam buka harus lebih awal dari jam tutup'
            });
        }
        
        const newRoom = await prisma.ruangan.create({
            data: {
                namaRuangan,   
                lokasiRuangan,  
                kapasitas,         
                jamBuka,
                jamTutup
            }
        });

        res.status(201).json({
            success: true,
            message: "Ruangan berhasil dibuat",
            data: newRoom
        });

    } catch (error) {
        console.log(error)
            res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat ruangan',
            error: error.message
        });
    }
};

const updateRoom = async (res, req) => {
    try {
        const {id} = req.params;
        const { namaRuangan, lokasiRuangan, kapasitas, jamBuka, jamTutup } = req.body;

        // Cek apakah ruangan ada
        const existingRoom = await prisma.ruangan.findUnique({
            where: {id: parseInt(id)}
        });
        if (!existingRoom) {
            return res.status(404).json({
                success: false,
                message: 'Ruangan tidak ditemukan'
            });
        }

        const updatedRoom = await prisma.ruangan.update({
            where: {id: parseInt(id)},
            data:{
                namaRuangan : namaRuangan,   
                lokasiRuangan : lokasiRuangan,  
                kapasitas: kapasitas,         
                jamBuka: jamBuka,
                jamTutup: jamTutup
            }
        });

        res.status(200).json({
            success: true,
            message: 'Ruangan berhasil diupdate',
            data: updatedRoom
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate ruangan',
            error: error.message
        });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const {id} = req.params;
        const existingRoom = await prisma.ruangan.findUnique({
            where:{id: parseInt(id)}
        });

        if (!room) {
            return res.status(404).json({
                succes: false,
                message: "Ruangan tidak ditemukan"
            });
        }

        await prisma.ruangan.delete({
            where: {id: parseInt(id)}
        })
        res.status(200).json({
            success: true,
            message: 'Ruangan berhasil dihapus'
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus ruangan',
            error: error.message
        });
    }
};

module.exports = {
    getAllRooms,
    getRoomsById,
    createRoom,
    updateRoom,
    deleteRoom
};