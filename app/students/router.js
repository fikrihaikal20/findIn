var express = require('express');
var router = express.Router();
const { postVideo,acionEditStudent,dashboardStudent } = require('./controller')
const { isLoginUser } = require('../middleware/auth')
const multer = require('multer')
const { filestorage, fileFilter } = require('../../config/multerConfig')

router.post('/postVideo', isLoginUser('student'), multer({ storage: filestorage, fileFilter: fileFilter }).single('videos'), postVideo);
router.put('/editStudent', isLoginUser('student'), multer({ storage: filestorage, fileFilter: fileFilter }).single('photo'),acionEditStudent);
router.get('/dashboardStudent', isLoginUser('student'), dashboardStudent);

module.exports = router;
