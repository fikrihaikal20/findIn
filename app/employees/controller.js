const db = require('../../models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const student = db.sequelize.models.student;
const apply = db.sequelize.models.apply;
const internjobs = db.sequelize.models.internjobs;

module.exports = {
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


    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  deteleLowongan: async (req, res) => {
    try {
      const { id } = req.params;
      await internjobs.destroy({ where: { id } });

      res.status(200).json({ message: "successfully deleted" })

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
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

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  actionEditLowongan: async (req, res) => {
    try {
      const { id } = req.params
      const { posisi, perusahaan, lokasi, deskripsi } = req.body
      const data = await internjobs.update({ posisi, perusahaan, lokasi, deskripsi }, { where: { id } });

      res.status(200).json({ message: "successfully updated", data })

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
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

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

}