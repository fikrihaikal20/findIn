var express = require('express');
var router = express.Router();
const { viewLowongan,deteleLowongan,detailLowongan,actionEditLowongan,applier,acionEditEmployee} = require('./controller')
const { isLoginUser } = require('../middleware/auth')
const multer = require('multer')

const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null,  new Date().getTime() + " - " +file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
      ) {
      cb(null, true)
    } else {
      req.fileValidationError = 'Only Images file are allowed';
      return cb(null, false, new Error('Only Images file are allowed'));
    }
}


router.put('/editEmployee', isLoginUser('employee'), multer({ storage: filestorage, fileFilter: fileFilter }).single('photo'),acionEditEmployee);
router.get('/lowongan', isLoginUser('employee'), viewLowongan);
router.delete('/lowongan/:id', isLoginUser('employee'), deteleLowongan);

router.get('/lowongan/:id', isLoginUser('employee'), detailLowongan);
router.put('/lowongan/:id', isLoginUser('employee'), actionEditLowongan);
router.get('/applier/', isLoginUser('employee'), applier);

module.exports = router;
