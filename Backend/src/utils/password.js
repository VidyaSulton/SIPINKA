const bcrypt = require('bcryptjs');

// hashPassword berfungsi untuk meng-hash password sebelum disimpan ke database
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// comparePassword berfungsi untuk membandingkan password yang diinput user dengan password yang sudah di-hash
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {hashPassword, comparePassword};