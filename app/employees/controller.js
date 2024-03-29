const db = require('../../models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const student = db.sequelize.models.student;
const apply = db.sequelize.models.apply;
const employee = db.sequelize.models.employee;
const internjobs = db.sequelize.models.internjobs;
const fs = require('fs')

module.exports = {
  acionEditEmployee: async (req, res) => {
    try {
      const { id } = req.user
      const { username, perusahaan } = req.body;

      const result = await employee.findOne({ 
        where: { id},
        attributes: ['photo']
      })

      let photo = ""
      if(result !== null){
        photo = result.photo
        if (fs.existsSync(photo)) {
          fs.unlinkSync(photo);
        }
      }

      if (req.file) {
        photo = req.file.path
      }

      if (req.fileValidationError) {
        return res.status(422).json({ error: req.fileValidationError });
      }

      await employee.update({ username, perusahaan, photo}, {
        where: { id }
      });

      res.status(200).json({ message: 'Successfully made changes' })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  viewLowongan: async (req, res) => {
    try {
      const { id } = req.user
      const cari2 = await internjobs.findAll({
        where: {
          employeeId: id
        },
        attributes: ['id', 'posisi', 'tenggat', 'status']
      });

      const data1 = cari2;

      const ids = cari2.map(obj => obj.id);
      const jmlh = await apply.findAll({
        attributes: [
          'internjobId',
          [Sequelize.fn('COUNT', Sequelize.col('internjobId')), 'count']
        ],
        where: {
          internjobId: {
            [Op.in]: ids
          }
        },
        group: ['internjobId']
      })

      const data2 = jmlh;

      res.status(200).json({ data: data1, data2: data2 })


    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  deteleLowongan: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await internjobs.findOne({
        where: {
          id
        },
        attributes: ['panduan']
      });

      fs.unlink(data.panduan, () => { });
      await internjobs.destroy({ where: { id } });

      res.status(200).json({ message: "successfully deleted",  })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  detailLowongan: async (req, res) => {
    try {
      const { id } = req.params
      const result = await internjobs.findOne({
        where: {
          id
        },
        attributes: ['posisi', 'perusahaan', 'lokasi', 'deskripsi']
      });

      res.status(200).json({ data: result })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  actionEditLowongan: async (req, res) => {
    try {
      const { id } = req.params
      const { posisi, perusahaan, lokasi, deskripsi } = req.body
      const data = await internjobs.update({ posisi, perusahaan, lokasi, deskripsi }, { where: { id } });

      res.status(200).json({ message: "successfully updated", data })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  applier: async (req, res) => {
    try {
      const { id } = req.user
      const cari = await internjobs.findAll({
        where: {
          employeeId: id
        },
        include: {
          model: student,
          attributes: ['nim', 'nama', 'universitas', 'noTelp'],
          through: {
            attributes: []
          }
        },
        attributes: ['id', 'posisi']
      });

      res.status(200).json({ data: cari })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  pilihApplier: async (req, res) => {
    try {
      const { nim } = req.params
      const result = await apply.update(
        { status: "diterima" },
        { where:  {studentNim : nim}  }
      );

      console.log(result)
      res.status(200).json({ data: result })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  subscribe: async (req, res) => {
    try {
      const { id } = req.user
      const result = await employee.update(
        { limit: Infinity },
        { where:  {id}  }
      );

      res.status(200).json({ data: result, message: "Subscribe Berhasil" })

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}