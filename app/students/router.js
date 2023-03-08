var express = require('express');
var router = express.Router();
const { postVideo,acionEditStudent,dashboardStudent } = require('./controller')
const { isLoginUser } = require('../middleware/auth')
const multer = require('multer')

const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/videos')
    },
    filename: (req, file, cb) => {
        cb(null,  new Date().getTime() + " - " +file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(new Error('Only MP4 videos are allowed'));
    }
}

router.post('/postVideo', isLoginUser('student'), multer({ storage: filestorage, fileFilter: fileFilter }).single('videos'), postVideo);
router.put('/editStudent', isLoginUser('student'), acionEditStudent);
router.get('/dashboardStudent', isLoginUser('student'), dashboardStudent);

module.exports = router;
