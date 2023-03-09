const db = require('../../models');
const student = db.sequelize.models.student;
const expertise = db.sequelize.models.expertise;
const skills = db.sequelize.models.skills;
const apply = db.sequelize.models.apply;
const intenjobs = db.sequelize.models.internjobs;
const fs = require('fs')

module.exports = {
  student: async (req, res) => {
    try {
      const data = await student.findAll({
        attributes: ['nim','nama', 'universitas', 'expertise']
      });

      res.status(200).json({ data: data })

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  intern: async (req, res) => {
    try {
      const data = await intenjobs.findAll({
        attributes: ['id','posisi','lokasi','perusahaan','jenis']
      });

      res.status(200).json({ data: data })


    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  detailIntern: async (req, res) => {
    try {
      const {id} = req.params;

      const data = await intenjobs.findOne({
        where: { id },
        attributes: ['id','posisi','lokasi','perusahaan','jenis','deskripsi','panduan']
      });

      res.status(200).json({ data: data })

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  detailStudent: async (req, res) => {
    try {
      const {nim} = req.params;

      const data = await student.findOne({
        where: { nim },
        attributes: ['nim', 'nama', 'universitas', 'prodi', 'expertise', 'skills', 'deskripsi']
      });

      res.status(200).json({ data: data })

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
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

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  findIntern: async (req, res) => {
    try {
      const {jenis, lokasi, posisi} = req.query
      const data = await intenjobs.findAll({ 
        where: { jenis, lokasi, posisi},
        attributes: ['id','posisi','lokasi','perusahaan','jenis']
      })

      res.status(200).json({ data: data })

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
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
      const {posisi,perusahaan,lokasi,tipe,jenis,deskripsi,tenggat} = req.body
      const panduan = req.file.path
      const input = {
        employeeId: id,
        posisi,
        perusahaan,
        lokasi,
        tipe,
        jenis,
        deskripsi,
        tenggat,
        panduan
      }
      await intenjobs.create(input);
      res.json({ message: `Successfully posted internJobs` })


    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
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

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error'});
    }
  }
  
}