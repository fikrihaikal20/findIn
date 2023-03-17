const db = require('../../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validateEmail, validatePassword } = require('../helpers/validation')
const student = db.sequelize.models.student;
const employee = db.sequelize.models.employee;

const secret = process.env.JWT_SECRET;

module.exports = {
  signupStudent: async (req, res, next) => {
    try {
      const {
        nim,
        nama,
        email,
        tahunMasuk,
        password,
        noTelp,
        domisili,
        universitas,
        prodi,
        nik,
        skills,
        expertise
      } = req.body;

      const data = await student.findOne({
        where: { nim }
      });

      if (data) {
        return res.status(409).json({ message: "Anda telah terdaftar" });
      }

      if (req.fileValidationError) {
        return res.status(422).json({ error: req.fileValidationError });
      }

      let cv = '';
      let sertifikat = '';

      if (req.files && req.files.cv) {
        cv = req.files.cv[0].path;
      }
      if (req.files && req.files.sertifikat) {
        sertifikat = req.files.sertifikat[0].path;
      }

      if (!validateEmail(email)) {
        const error = new Error('Gunakan alamat email yang benar')
        error.name = 'ValidationError'
        error.errors = { email: 'Gunakan alamat email yang benar' }
        throw error
      }

      if (!validatePassword(password)) {
        const error = new Error('Password harus unique')
        error.name = 'ValidationError'
        error.errors = { password: 'Password harus unique' }
        throw error
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = await student.create({
        nim,
        nama,
        email,
        tahunMasuk,
        password: hashedPassword,
        noTelp,
        domisili,
        universitas,
        prodi,
        nik,
        skills,
        expertise,
        cv,
        sertifikat
      })

      res.status(201).json({
        message: 'Berhasil membuat akun',
        data: newStudent
      })

    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(422).json({message: error.message})
      } else {
        res.status(500).send({ error: error.message });
      }
    }
  },
  signupEmployee: async (req, res, next) => {
    try {
      const { username, email, password, perusahaan } = req.body;

      const data = await employee.findOne({
        where: { email }
      });

      if (data) {
        const error = new Error('Email telah terdaftar')
        error.name = 'ValidationError'
        error.errors = { email: 'Email telah terdaftar' }
        throw error
      }

      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      // Validasi email
      if (!(re.test(email))) {
        const error = new Error('Gunakan alamat email yang benar')
        error.name = 'ValidationError'
        error.errors = { email: 'Gunakan alamat email yang benar' }
        throw error
      }

      // Validasi password
      if (!validatePassword(password)) {
        const error = new Error('Password harus unique')
        error.name = 'ValidationError'
        error.errors = { password: 'Password harus unique' }
        throw error
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Proses pembuatan akun
      const newEmployee = await employee.create({
        username, email, password: hashedPassword, perusahaan
      })

      res.status(201).json({
        message: 'Berhasil membuat akun',
        data: newEmployee
      })

    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(422).json({ message: error.message })
      }
      next(error)
    }
  },
  signin: async (req, res, next) => {
    try {
      const { email, password, userType } = req.body;

      let user;
      if (userType === 'student') {
        user = await student.findOne({ where: { email } });
      } else if (userType === 'employee') {
        user = await employee.findOne({ where: { email } });
      }

      let token;
      if (user) {
        const checkPassword = bcrypt.compareSync(password, user.password)
        if (checkPassword) {
          if (userType === 'student') {
            token = jwt.sign({
              user: {
                nim: user.nim,
                nama: user.nama,
                email: user.email,
                noTelp: user.noTelp,
                domisili: user.phoneNumber,
                universitas: user.universitas,
                prodi: user.prodi,
                deskripsi: user.deskripsi,
                skills: user.skills,
                expertise: user.expertise,
                role: "student"
              }
            }, secret)
          } else {
            token = jwt.sign({
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                nama: user.nama,
                perusahaan: user.perusahaan,
                limit: user.limit,
                role: "employee"
              }
            }, secret)
          }
          res.status(200).json({
            data: { token, message: "Berhasil Log in" },
          })

        } else {
          res.status(401).json({
            message: 'Password salah'
          })
        }
      } else {
        res.status(404).json({
          message: 'Email belum terdaftar'
        })
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}