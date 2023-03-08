const db = require('../../models');
const jwt = require('jsonwebtoken')
const student = db.sequelize.models.student;
const employee = db.sequelize.models.employee;

const secret = process.env.JWT_SECRET;

module.exports = {
  isLoginUser: (role) => async (req, res, next) => {
    try {
      const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

      const data = jwt.verify(token, secret)

      let user;
      if (role === 'student') {
        user = await student.findOne({ where: { nim : data.user.nim } });
      } else if (role === 'employee') {
        user = await employee.findOne({ where: { id : data.user.id } });
      }

      if (!user) {
        throw new Error()
      }

      req.user = user
      next()
    } catch (err) {
      res.status(401).json({
        error: 'Not authorized to acces this resource'
      })
      next(err)
    }

  }
}