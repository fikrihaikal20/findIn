var express = require('express');
var router = express.Router();
const { student, detailStudent, detailIntern, intern, findIntern, findStudent, postIntern, applyIntern } = require('./controller')
const { isLoginUser } = require('../middleware/auth')
const multer = require('multer')
const path = require('path');
const { filestorage, fileFilter } = require('../../config/multerConfig')

router.get('/student', student);
router.get('/Student/:nim', detailStudent);
router.post('/student', findStudent);
router.get('/intern', intern);
router.get('/intern/:id', detailIntern);
router.post('/intern', findIntern);
router.post('/postIntern/', isLoginUser('employee'), multer({ storage: filestorage, fileFilter: fileFilter }).single('panduan'), postIntern);
router.post('/applyIntern/:id', isLoginUser('student'), multer({ storage: filestorage, fileFilter: fileFilter }).fields([
    { name: 'cv', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), applyIntern);

module.exports = router;
