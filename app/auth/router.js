var express = require('express');
var router = express.Router();
const { signupStudent, signupEmployee, signin} = require('./controller')
const multer = require('multer')
const { filestorage, fileFilter } = require('../../config/multerConfig')

router.post('/signup/student', multer({ storage: filestorage, fileFilter: fileFilter }).fields([
    { name: 'cv', maxCount: 1, optional: true },
    { name: 'sertifikat', maxCount: 1, optional: true }
]), signupStudent);
router.post('/signup/employee', signupEmployee);
router.post('/signin/', signin);


module.exports = router;