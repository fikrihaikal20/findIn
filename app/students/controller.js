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
        return res.status(422).json({ error: req.fileValidationError })
      } else if (!req.file) {
        return res.status(400).json({ error: 'Silakan pilih file yang akan diunggah.' })
      }

      const { nim } = req.user
      const video = req.file.path
      await videos.create({ video, studentNim: nim })
      res.status(200).json({ message: `Success post video` })


    }  catch (error) {
      res.status(500).send({ error: error.message })
    }
  },
  acionEditStudent: async (req, res) => {
    try {
      if (req.fileValidationError) {
        return res.status(422).json({ error: req.fileValidationError });
      }
      const { nim } = req.user
      const { nama, universitas, prodi, expertise, skills, deskripsi } = req.body

      const result = await student.findOne({ 
        where: {nim},
        attributes: ['photo']
      })

      let photo = ""
      if(result !== null){
        photo = result.photo
        if (fs.existsSync(photo)) {
          fs.unlinkSync(photo)
        }
      }
      
      if (req.file) {
        photo = req.file.path
      }

      await student.update({ nama, universitas, prodi, expertise, skills, deskripsi, photo}, {
        where: { nim }
      })

      res.status(200).json({ message: 'Success melakukan perubahan' })

    }  catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  dashboardStudent: async (req, res) => {
    try {
      const { nim } = req.user
      const cari = await apply.findAll({
        where: {
          studentNim: nim
        },
        include: [
          {
            model: internjobs,
            required: false,
            attributes: ['perusahaan','posisi']
          }
        ],
        attributes: ['status']
      })
      
      const newData = cari.map(d => {
        const { perusahaan, posisi } = d.internjob
        const { status } = d
        return { perusahaan, posisi, status }
      })

      res.status(200).json({ data: newData })

    }  catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

}