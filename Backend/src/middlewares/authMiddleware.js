const { verifyToken } = require('../utils/jwt');

// middleware untuk mengautentikasi user berdasarkan token jwt, agar hanya user yang sudah login yang dapat mengakses route tertentu
const authenticate = (req, res, next) => {
    try {
        // Mengambil token dari header Authorization
        const authHeader = req.headers.authorization;
        // Cek apakah header Authorization ada
        if (!authHeader) {
            return res.status(401).json({
                success: false, 
                messagge: "Token tidak ditemukan, silahkan login"
            });
        }

        // Mengambil token dari header Authorization
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Format token salah"
            });
        }
        // Verifikasi token
        const decoded = verifyToken(token);

        // Simpan data user yang sudah terverifikasi ke objek req
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        // Lanjutkan ke controller berikutnya
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "token tidak valid atau sudah kadaluarsa",
            error: error.message
        });
    }
};

// middleware untuk memeriksa apakah user yang terautentikasi adalah admin
const isAdmin = async (req, res, next) => {
    try {
        // cek apakah user sudah terautentikasi
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Silakan login terlebih dahulu"
            });
        }
        // cek apakah user adalah admin
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "Hanya Admin yang dapat mengakses ini"
            })
        }
        // Jika user adalah admin, lanjutkan ke controller
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat verifikasi role",
            error: error.message
        });
    }
};

module.exports = { authenticate, isAdmin };