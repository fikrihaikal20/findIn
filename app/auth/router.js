var express = require('express');
var router = express.Router();
const { signupStudent, signupEmployee, signin } = require('./controller')

router.post('/signup/student', signupStudent);
router.post('/signup/employee', signupEmployee);
router.post('/signin/', signin);

module.exports = router;