const { generateToken, verifyToken} = require('../utils/jwt');
const { hashPassword, comparePassword} = require('../utils/password');
const { PrismaClient} = require('../../generated/prisma');

const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // validasi input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, dan nama wajib diisi'
            })
        }

        // validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid'
            });
        }

        // cek apakah email sudah terdaftar
        // findFirst digunakan untuk mencari satu data pertama yang sesuai dengan kondisi
        const existingUser = await prisma.user.findFirst({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar'
            })
        }

        const hashedPassword = await hashPassword(password);

        // simpan user baru ke db
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                role: 'USER'
            },
            select: {
                userId: true,
                username: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        // generate token jwt
        const token = generateToken({
            userId: newUser.userId,
            email: newUser.email,
            role: newUser.role
        });

        // Respon sukses
        res.status(200).json({
            success: true,
            message: "Registrasi berhasil",
            data: {
                user: newUser, token
            }
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat registrasi",
            error: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password} = req.body;

        // validasi input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email dan Password wajib diisi"
            });
        }

        // cari user berdasarkan email
        // findFirst digunakan untuk mencari satu data pertama yang sesuai dengan kondisi
        const user = await prisma.user.findFirst({
            where: {email}
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email atau Password salah"
            })
        };

        // verifikasi password
        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Email atau Password salah"
            })
        };

        // generate token jwt
        const token = generateToken({
            userId: user.userId,
            email: user.email,
            role: user.role
        });

        // respon login sukses
        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: {
                user: {
                    userId: user.userId,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },token 
            }
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat login",
            error: error.message
        })
    }
};

module.exports = { register, login };