const db = require('../../models');
const student = db.sequelize.models.student;
const apply = db.sequelize.models.apply;
const internjobs = db.sequelize.models.internjobs;
const fs = require('fs')

module.exports = {
  student: async (req, res) => {
    try {
      const data = await student.findAll({
        attributes: ['nim','nama','universitas','expertise','domisili']
      });

      res.status(200).json({ data: data })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  intern: async (req, res) => {
    try {
      const data = await internjobs.findAll({
        attributes: ['id','posisi','lokasi','perusahaan','jenisKerja']
      });

      res.status(200).json({ data: data })


    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  detailIntern: async (req, res) => {
    try {
      const {id} = req.params;
      console.error(id)
      const data = await internjobs.findOne({
        where: { id },
        attributes: ['id','posisi','lokasi','perusahaan','jenisKerja','metodeKerja','deskripsi','panduan']
      });

      res.status(200).json({ data: data })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  detailStudent: async (req, res) => {
    try {
      const {nim} = req.params;

      const data = await student.findOne({
        where: { nim },
        attributes: ['nim', 'nama', 'universitas', 'prodi', 'expertise', 'skills', 'deskripsi', 'domisili']
      });

      res.status(200).json({ data: data })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  findStudent: async (req, res) => {
    try {
      const {skills, expertise, domisili} = req.query
      const data = await student.findAll({ 
        where: { skills, expertise, domisili},
        attributes: ['nim', 'nama', 'universitas', 'expertise', 'skills']
      })

      res.status(200).json({ data: data })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  findIntern: async (req, res) => {
    try {
      const {jenis, lokasi, posisi} = req.query
      const data = await internjobs.findAll({ 
        where: { jenis, lokasi, posisi},
        attributes: ['id','posisi','lokasi','perusahaan','jenis']
      })

      res.status(200).json({ data: data })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  postIntern: async (req, res) => {
    try {
      if (req.fileValidationError) {
        return res.json({ error: req.fileValidationError });
      } else if (!req.file) {
        return res.json({ error: 'Please select a file to upload' });
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
      await internjobs.create(input);
      res.json({ message: `Successfully posted internJobs` })


    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  applyIntern: async (req, res) => {
    try {
      const cvFile = req.files.cv ? req.files.cv[0] : null;
      const resumeFile = req.files.resume ? req.files.resume[0] : null;

      const deleteFile = (cvFile,resumeFile) => {
        if (cvFile) fs.unlink(cvFile.path, () => { });
        if (resumeFile) fs.unlink(resumeFile.path, () => { });
      }

      if (req.fileValidationError) {
        deleteFile(cvFile, resumeFile)
        return res.json({ error: req.fileValidationError });
      } else if (!(cvFile && resumeFile)) {
        deleteFile(cvFile, resumeFile)
        return res.json({ error: 'Please select a file to upload' });
      }

      const { nim } = req.user
      const {id} = req.params
      const cv = cvFile.path
      const resume = resumeFile.path
      const [data, created] = await apply.findOrCreate({
        where: { internjobId: id, studentNim: nim },
        defaults: { cv, resume }
      });
      
      if (!created) {
        deleteFile(cvFile, resumeFile)
        return res.json({ error: 'Duplicate entry' });
      }
      
      res.json({ message: `Successfully applied`,data: data });

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  
}