const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
const authRoutes = require('./src/routes/authRoutes')
const roomRoutes = require('./src/routes/roomRoutes');

const app =  express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3050;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/test',(req,res)=>{
    res.json({
        message: "the backend is running btw",
        endpoints: {
            auth:'/api/auth (register, login)',
            rooms:'/api/rooms(CRUD ruangan)'
        }
    });
});

app.get('/test/db', async (req, res) => {
    try {
        await prisma.$connect();
        res.json({message: "Koneksi ke database berhasil"});
    } catch (error) {
        res.status(500).json({message: "Koneksi ke database gagal", error: error.message});
    }
})

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint tidak ditemukan"
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
})