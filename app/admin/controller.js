const db = require('../../models');
const internjobs = db.sequelize.models.internjobs;
const student = db.sequelize.models.student;
const employee = db.sequelize.models.employee;

module.exports = {
  viewSignin: async (req, res) => {
    const alertMessage = req.flash("alertMessage")
    const alertStatus = req.flash("alertStatus")

    const alert = { message: alertMessage, status: alertStatus}

    res.render('login', { alert })
  },
  Signin: async (req, res) => {
    try {
      const {email, password} = req.body;
      if( email === "admin@gmail.com" && password ==="admin"){
        req.session.admin = {
          email: email,
          password : password
        }
        res.redirect('/lowongan')
      }else{
        req.flash('alertMessage', "Password atau email salah")
        req.flash('alertStatus', "danger")
        res.redirect('/');
      }
      
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  actionLogout : (req, res)=>{
    req.session.destroy();
    res.redirect('/')
  },
  lowongan : async (req, res)=>{

    const alertMessage = req.flash("alertMessage")
    const alertStatus = req.flash("alertStatus")

    const alert = { message: alertMessage, status: alertStatus}

    const data = await internjobs.findAll({
      attributes: ['id', 'posisi', 'tenggat', 'status', 'tipe', 'noTelp']
    });

     
    res.render('admin/lowongan/view_lowongan',{data , alert})
  },
  student : async (req, res)=>{

    const alertMessage = req.flash("alertMessage")
    const alertStatus = req.flash("alertStatus")

    const alert = { message: alertMessage, status: alertStatus}

    const data = await student.findAll({
      attributes: ['nim', 'nama', 'email','nik','isVerified']
    });

     
    res.render('admin/student/view_student',{data, alert})
  },
  employee : async (req, res)=>{

    const alertMessage = req.flash("alertMessage")
    const alertStatus = req.flash("alertStatus")

    const alert = { message: alertMessage, status: alertStatus}

    const data = await employee.findAll({
      attributes: ['id', 'username', 'perusahaan','limit','email']
    });

     
    res.render('admin/employee/view_employee',{data, alert})
  },
  statusLowongan : async (req, res)=>{
     
    const id = req.params.id;
    const status = req.body.status;

    try {
      const result = await internjobs.update({
        status: status
      }, {
        where: { id: id }
      });

      req.flash('alertMessage', "Successfully Edited")
      req.flash('alertStatus', "success")

      res.redirect('/lowongan');
    } catch (error) {
      console.log(error);
      res.send('Terjadi kesalahan');
    }
  },
  statusStudent : async (req, res)=>{
     
    const nim = req.params.nim;
    const isVerified = req.body.isVerified;

    try {
      const result = await student.update({
        isVerified: isVerified
      }, {
        where: { nim: nim }
      });

      req.flash('alertMessage', "Successfully Edited")
      req.flash('alertStatus', "success")

      res.redirect('/student');
    } catch (error) {
      console.log(error);
      res.send('Terjadi kesalahan');
    }
  },
  hapusLowongan : async (req, res)=>{
    const id = req.params.id;
    try {
      await internjobs.destroy({ where: { id } })
      req.flash('alertMessage', "Successfully Deleted")
      req.flash('alertStatus', "success")

      res.redirect('/lowongan');
    } catch (error) {
      console.log(error);
      res.send('Terjadi kesalahan');
    }
  },
  hapusStudent : async (req, res)=>{
    const nim = req.params.nim;
    try {
      await student.destroy({ where: { nim } })
      req.flash('alertMessage', "Successfully Deleted")
      req.flash('alertStatus', "success")

      res.redirect('/student');
    } catch (error) {
      console.log(error);
      res.send('Terjadi kesalahan');
    }
  },
  hapusEmployee : async (req, res)=>{
    const id = req.params.nim;
    try {
      await employee.destroy({ where: { id } })
      req.flash('alertMessage', "Successfully Deleted")
      req.flash('alertStatus', "success")

      res.redirect('/employee');
    } catch (error) {
      console.log(error);
      res.send('Terjadi kesalahan');
    }
  }
}