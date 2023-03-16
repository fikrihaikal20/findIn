var express = require('express');
var router = express.Router();
const { viewSignin,Signin,actionLogout,lowongan,statusLowongan,student,statusStudent} = require('./controller')
const { isLoginAdmin } = require('../middleware/auth')

router.get('/', viewSignin);
router.get('/lowongan', isLoginAdmin, lowongan);
router.get('/student', isLoginAdmin, student);
router.post('/statusLowongan/:id', isLoginAdmin, statusLowongan);
router.post('/statusStudent/:nim', isLoginAdmin, statusStudent);
router.post('/signin', Signin);
router.get('/logout', isLoginAdmin, actionLogout);

module.exports = router;
