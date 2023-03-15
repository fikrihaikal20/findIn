const multer = require('multer')

const filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "videos") {
      cb(null, './public/videos')
    } else if (file.fieldname === "photo") {
      cb(null, './public/images')
    } else if (
      file.fieldname === "cv" ||
      file.fieldname === "panduan" ||
      file.fieldname === "resume") {
      cb(null, './public/documents')
    }
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + " - " + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "videos") {
    if (file.mimetype !== 'video/mp4') {
      req.fileValidationError = 'Only MP4 videos are allowed';
      return cb(null, false, new Error('Only MP4 videos are allowed'));
    } else {
      cb(null, true)
    }
  } else if (file.fieldname === "photo") {
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
  } else if (
    file.fieldname === "cv" ||
    file.fieldname === "panduan" ||
    file.fieldname === "resume") {
      if (file.mimetype !== 'application/pdf') {
          req.fileValidationError = 'Only PDF files are allowed';
          return cb(null, false, new Error('Only PDF files are allowed'));
      }else{
          cb(null, true);
      }
    }
}

module.exports = { filestorage, fileFilter };
