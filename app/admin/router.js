var express = require('express')
var router = express.Router()
const { viewSignin,Signin,actionLogout,lowongan,statusLowongan,student,statusStudent,hapusLowongan,employee,hapusStudent,hapusEmployee} = require('./controller')
const { isLoginAdmin } = require('../middleware/auth')

router.get('/', viewSignin)
router.get('/lowongan', isLoginAdmin, lowongan)
router.get('/student', isLoginAdmin, student)
router.get('/employee', isLoginAdmin, employee)
router.post('/statusLowongan/:id', isLoginAdmin, statusLowongan)
router.post('/statusStudent/:nim', isLoginAdmin, statusStudent)
router.post('/hapusLowongan/:id', isLoginAdmin, hapusLowongan)
router.post('/hapusStudent/:nim', isLoginAdmin, hapusStudent)
router.post('/hapusEmployee/:id', isLoginAdmin, hapusEmployee)
router.post('/signin', Signin)
router.get('/logout', isLoginAdmin, actionLogout)

module.exports = router
