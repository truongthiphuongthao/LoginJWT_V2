const express = require('express')
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')
const cookieParser = require('cookie-parser')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static('public'))

// set view
app.set('views', './public/pages')
app.set('view engine', 'ejs')

app.use(cookieParser());
app.use('/', routes)


app.listen(8080, () => {
  console.log("Server is starting at port 8080")
})
