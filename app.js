require('dotenv').config();
const express = require('express')
const app = express()
const bodyparser = require("body-parser")
const port = 8016
const path = require('path')

app.use('/documents', express.static(path.join(__dirname, 'public/documents')))

app.use(express.json())
app.use(bodyparser.urlencoded({ extended : true}))

const authRouter = require('./app/auth/router')
const userEndpoint = require('./app/user/router')
const studentEndpoint = require('./app/students/router')
const employeesEndpoint = require('./app/employees/router')

app.use('/auth', authRouter)
app.use('/user', userEndpoint)
app.use('/students', studentEndpoint)
app.use('/employee', employeesEndpoint)

const db = require('./models')

db.sequelize.sync({force : true})
  .then(() => {
    app.listen(port, () => {
      console.log(`Server berjalan pada port ${port}`)
    })
  })
  .catch((error) => {
    console.log(`Error sync database: ${error}`)
  })

module.exports = app
