const db = require('../../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator');
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
        password, 
        noTelp, 
        domisili, 
        universitas, 
        prodi,
        tahunMasuk, 
        nik, 
        deskripsi, 
        skills, 
        expertise
      } = req.body;

      if (req.fileValidationError) {
        return res.json({ error: req.fileValidationError });
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
        const error = new Error('Email invalid')
        error.name = 'ValidationError'
        error.errors = { email: 'Email invalid' }
        throw error
      }

      if (!validatePassword(password)) {
        const error = new Error('Password invalid')
        error.name = 'ValidationError'
        error.errors = { password: 'Password invalid' }
        throw error
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = await student.create({
        nim, 
        nama, 
        email,
        password : hashedPassword, 
        noTelp, 
        domisili, 
        universitas, 
        prodi,
        tahunMasuk, 
        nik, 
        deskripsi, 
        skills, 
        expertise,
        sertifikat,
        cv
      })

      res.status(201).json({
        message: 'Successfully created account',
        data: newStudent
      })

    } catch (err) {
      if (err && err.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors
        })
      }
      next(err)
    }
  },
  signupEmployee: async (req, res, next) => {
    try {
      const { username, email, password, perusahaan } = req.body;

      const re =/^[^\s@]+@[^\s@]+\.[^\s@]+$/
      // Validasi email
      if (!(re.test(email))) {
        const error = new Error('Email invalid')
        error.name = 'ValidationError'
        error.errors = { email: 'Email invalid' }
        throw error
      }

      // Validasi password
      if (!validator.isEmail(email)) {
        const error = new Error('Password invalid')
        error.name = 'ValidationError'
        error.errors = { password: 'Password invalid' }
        throw error
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Proses pembuatan akun
      const newEmployee = await employee.create({
        username, email, password: hashedPassword, perusahaan
      })

      res.status(201).json({
        message: 'Successfully created account',
        data: newEmployee
      })

    } catch (err) {
      if (err && err.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors
        })
      }
      next(err)
    }
  },
  signin: async (req, res, next) => {
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
              expertise: user.expertise
            }
          }, secret)
        }else{
          token = jwt.sign({
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              nama: user.nama,
              perusahaan: user.perusahaan,
              limit: user.limit
            }
          }, secret)
        }
        res.status(200).json({
          data: { token , message: "Successfully logged in" },
        })

      } else {
        res.status(403).json({
          message: 'password incorrect'
        })
      }
    } else {
      res.status(403).json({
        message: 'Email is not registered yet'
      })
    }
  }
}