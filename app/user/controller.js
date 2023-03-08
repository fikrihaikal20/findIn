const db = require('../../models');
const student = db.sequelize.models.student;
const expertise = db.sequelize.models.expertise;
const skills = db.sequelize.models.skills;
const apply = db.sequelize.models.apply;
const intenjobs = db.sequelize.models.internjobs;

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
      if(!req.file){
        const err = new Error(res.json({ message: `File must be uploaded` }))
        err.errorStatus = 422;
        throw err;
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
      if(!req.files){
        const err = new Error(res.json({ message: `File must be uploaded` }))
        err.errorStatus = 422;
        throw err;
      }
      const { nim } = req.user
      const {id} = req.params
      const cv = req.files['cv'][0].path
      const resume = req.files['resume'][0].path
      const input = {
        cv,
        resume,
        internjobId:id,
        studentNim :nim
      }
      await apply.create(input);
      res.json({ message: `Successfully Apply` })


    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error'});
    }
  }
  
}