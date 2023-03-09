var express = require('express');
var router = express.Router();
const { signupStudent, signupEmployee, signin } = require('./controller')
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

router.post('/signup/student', multer({ storage: filestorage, fileFilter: fileFilter }).fields([
    { name: 'cv', maxCount: 1, optional: true },
    { name: 'sertifikat', maxCount: 1, optional: true }
]), signupStudent);
router.post('/signup/employee', signupEmployee);
router.post('/signin/', signin);

module.exports = router;