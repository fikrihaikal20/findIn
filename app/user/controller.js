const db = require('../../models')
const Sequelize = require('sequelize')
const student = db.sequelize.models.student
const employee = db.sequelize.models.employee
const apply = db.sequelize.models.apply
const internjobs = db.sequelize.models.internjobs
const fs = require('fs')
const Op = Sequelize.Op

module.exports = {
  student: async (req, res) => {
    try {
      const data = await student.findAll({
        attributes: ['nim','nama','universitas','expertise','domisili']
      })

      res.status(200).json({ data: data })

    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  },
  intern: async (req, res) => {
    try {
      const data = await internjobs.findAll({
        attributes: ['id','posisi','lokasi','perusahaan','jenisKerja']
      })

      res.status(200).json({ data: data })


    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  },
  detailIntern: async (req, res) => {
    try {
      const {id} = req.params
      console.error(id)
      const data = await internjobs.findOne({
        where: { id },
        attributes: ['id','posisi','lokasi','perusahaan','jenisKerja','metodeKerja','deskripsi','panduan']
      })

      res.status(200).json({ data: data })

    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  },
  detailStudent: async (req, res) => {
    try {
      const {nim} = req.params

      const data = await student.findOne({
        where: { nim },
        attributes: ['nim', 'nama', 'universitas', 'prodi', 'expertise', 'skills', 'deskripsi', 'domisili']
      })

      res.status(200).json({ data: data })

    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  },
  findStudent: async (req, res) => {
    try {
      const { query } = req.query

      const where = {
        [Op.or]: [
          {
            skills: {
              [Op.like]: `%${query}%`
            }
          },
          {
            expertise: {
              [Op.like]: `%${query}%`
            }
          },
          {
            domisili: {
              [Op.like]: `%${query}%`
            }
          },
          {
            nama: {
              [Op.like]: `%${query}%`
            }
          }
        ]
      }
    
      const data = await student.findAll({
        where: where,
        attributes: ['nim', 'nama', 'universitas', 'expertise', 'skills']
      })

      if (data.length === 0) {
        res.status(404).json({message : "Data tidak ditemukan"})
      }

      res.status(200).json({data : data})

    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  },
  findIntern: async (req, res) => {
    try {
      const {query} = req.query

      const where = {
        [Op.or]: [
          {
            posisi: {
              [Op.like]: `%${query}%`
            }
          },
          {
            lokasi: {
              [Op.like]: `%${query}%`
            }
          },
          {
            perusahaan: {
              [Op.like]: `%${query}%`
            }
          },
          {
            jenisKerja: {
              [Op.like]: `%${query}%`
            }
          }
        ]
      }

      const data = await internjobs.findAll({ 
        where: where,
        attributes: ['id','posisi','lokasi','perusahaan','jenisKerja']
      })

      if (data.length === 0) {
        res.status(404).json({message : "Data tidak ditemukan"})
      }

      res.status(200).json({data : data})

    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  postIntern: async (req, res) => {
    try {
      if (req.fileValidationError) {
        return res.status(422).json({ error: req.fileValidationError })
      } else if (!req.file) {
        return res.status(400).json({ error: 'Please select a file to upload' })
      }

      const { id } = req.user
      const {posisi,perusahaan,lokasi,tipe,jenisKerja,deskripsi,metodeKerja,tenggat,noTelp} = req.body
      const panduan = req.file.path
      const input = {
        employeeId: id,
        posisi,
        perusahaan,
        lokasi,
        tipe,
        jenisKerja,
        deskripsi,
        metodeKerja,
        tenggat,
        noTelp,
        panduan
      }

      let limit
      limit = await employee.findOne({ 
        where: {id},
        attributes: ['limit']
      })

      let kuota = limit.limit
      let pesan
      if(kuota !== 0 || tipe !== 'standar'){
        if(tipe == 'standar'){
          kuota--
          pesan = "Sukses post internJobs"
        }else{
          pesan = "Sukses post internJobs, kami akan menghubungi anda segera"
        }

        await employee.update({ limit: kuota },{
          where: { id }
        })
        await internjobs.create(input)
        
        return res.status(200).json({ message: pesan})
      }

      res.status(429).json({ message: `limit post anda telah habis, subscribe segera`})
      
    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  },
  applyIntern: async (req, res) => {
    try {
      const cvFile = req.files.cv ? req.files.cv[0] : null
      const resumeFile = req.files.resume ? req.files.resume[0] : null

      const deleteFile = (cvFile,resumeFile) => {
        if (cvFile) fs.unlink(cvFile.path, () => { })
        if (resumeFile) fs.unlink(resumeFile.path, () => { })
      }

      if (req.fileValidationError) {
        deleteFile(cvFile, resumeFile)
        return res.status(422).json({ error: req.fileValidationError })
      } else if (!(cvFile && resumeFile)) {
        deleteFile(cvFile, resumeFile)
        return res.status(400).json({ error: 'Please select a file to upload' })
      }

      const { nim } = req.user
      const {id} = req.params
      const cv = cvFile.path
      const resume = resumeFile.path
      const [data, created] = await apply.findOrCreate({
        where: { internjobId: id, studentNim: nim },
        defaults: { cv, resume }
      })
      
      if (!created) {
        deleteFile(cvFile, resumeFile)
        return res.status(409).json({ error: 'Duplicate entry' })
      }
      
      res.status(200).json({ message: `Successfully applied`,data: data })

    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  }
  
}