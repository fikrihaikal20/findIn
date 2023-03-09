var express = require('express');
var router = express.Router();
const { student, detailStudent, detailIntern, intern, findIntern, findStudent, postIntern, applyIntern } = require('./controller')
const { isLoginUser } = require('../middleware/auth')
const multer = require('multer')
const path = require('path');

const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/documents')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + " - " + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    if (!(mimetype && extname)) {
        req.fileValidationError = 'Only PDF files are allowed';
        return cb(null, false, new Error('Only PDF files are allowed'));
    }else{
        cb(null, true);
    }
}

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
