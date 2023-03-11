var express = require('express');
var router = express.Router();
const { postVideo,acionEditStudent,dashboardStudent } = require('./controller')
const { isLoginUser } = require('../middleware/auth')
const multer = require('multer')

const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "videos") { 
        cb(null, './public/videos')
      } else { 
        cb(null, './public/images')
      }
    },
    filename: (req, file, cb) => {
        cb(null,  new Date().getTime() + " - " +file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
  if(file.fieldname === "videos"){
    if (file.mimetype !== 'video/mp4') {
      req.fileValidationError = 'Only MP4 videos are allowed';
      return cb(null, false, new Error('Only MP4 videos are allowed'));
    } else {
      cb(null, true)
    }
  }else{
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
}

router.post('/postVideo', isLoginUser('student'), multer({ storage: filestorage, fileFilter: fileFilter }).single('videos'), postVideo);
router.put('/editStudent', isLoginUser('student'), multer({ storage: filestorage, fileFilter: fileFilter }).single('photo'),acionEditStudent);
router.get('/dashboardStudent', isLoginUser('student'), dashboardStudent);

module.exports = router;
