const db = require('../../models');
const student = db.sequelize.models.student;
const apply = db.sequelize.models.apply;
const internjobs = db.sequelize.models.internjobs;
const videos = db.sequelize.models.videos;
const fs = require('fs')

module.exports = {
  postVideo: async (req, res) => {
    try {
      if (req.fileValidationError) {
        return res.json({ error: req.fileValidationError });
      } else if (!req.file) {
        return res.json({ error: 'Please select a file to upload' });
      }

      const { nim } = req.user
      const video = req.file.path
      await videos.create({ video, studentNim: nim })
      res.json({ message: `Successfully posted video` })


    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  acionEditStudent: async (req, res) => {
    try {
      const { nim } = req.user
      const { nama, universitas, prodi, expertise, skills, deskripsi } = req.body;

      const result = await student.findOne({ 
        where: {nim},
        attributes: ['photo']
      })

      let photo = result.photo
      if (req.file) {
        fs.unlink(result.photo, () => { });
        photo = req.file.path
      }

      await student.update({ nama, universitas, prodi, expertise, skills, deskripsi, photo}, {
        where: { nim }
      });

      res.status(200).json({ message: 'Successfully made changes' })

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  dashboardStudent: async (req, res) => {
    try {
      const { nim } = req.user
      const cari = await apply.findAll({
        where: {
          studentNim: nim
        },
        include: {
          model: internjobs,
          required: false
        }
      });

      let result = {};
      cari.forEach(item => {
        result[item.id] = {
          posisi: item.internjob.posisi,
          perusahaan: item.internjob.perusahaan,
          status: item.internjob.status
        }
      });

      res.status(200).json({ data: result })

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

}