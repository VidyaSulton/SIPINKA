const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');

const app =  express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3050;

app.use(cors());
app.use(express.json());

app.get('/test',(req,res)=>{
    res.json("Kont")
})

app.get('/test/db', async (req, res) => {
    try {
        await prisma.$connect();
        res.json({message: "Koneksi ke database berhasil"});
    } catch (error) {
        res.status(500).json({message: "Koneksi ke database gagal", error: error.message});
    }
})

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
})