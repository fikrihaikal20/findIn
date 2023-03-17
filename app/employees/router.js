var express = require('express');
var router = express.Router();
const { viewLowongan,deteleLowongan,detailLowongan,actionEditLowongan,applier,acionEditEmployee,subscribe} = require('./controller')
const { isLoginUser } = require('../middleware/auth')
const multer = require('multer')
const { filestorage, fileFilter } = require('../../config/multerConfig')


router.put('/editEmployee', isLoginUser('employee'), multer({ storage: filestorage, fileFilter: fileFilter }).single('photo'),acionEditEmployee);
router.get('/lowongan', isLoginUser('employee'), viewLowongan);
router.delete('/lowongan/:id', isLoginUser('employee'), deteleLowongan);

router.get('/lowongan/:id', isLoginUser('employee'), detailLowongan);
router.put('/lowongan/:id', isLoginUser('employee'), actionEditLowongan);
router.get('/applier/', isLoginUser('employee'), applier);

router.put('/subscribe/', isLoginUser('employee'), subscribe);

module.exports = router;
