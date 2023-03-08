var express = require('express');
var router = express.Router();
const { viewLowongan,deteleLowongan,detailLowongan,actionEditLowongan,applier } = require('./controller')
const { isLoginUser } = require('../middleware/auth')

router.get('/lowongan', isLoginUser('employee'), viewLowongan);
router.delete('/lowongan/:id', isLoginUser('employee'), deteleLowongan);

router.get('/lowongan/:id', isLoginUser('employee'), detailLowongan);
router.put('/lowongan/:id', isLoginUser('employee'), actionEditLowongan);
router.get('/applier/', isLoginUser('employee'), applier);

module.exports = router;
