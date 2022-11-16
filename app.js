const path = require('path')

const express = require('express')
const cors = require('cors')
const session = require('express-session')
const mongodbStore = require('connect-mongodb-session')

const db = require('./data/database')
const app = express();

const server = require('http').createServer(app);

app.use(cors())

app.get('/', function (req, res) {
    console.log(req)
    res.send("get")
})

app.post('/', function(req, res) {
    console.log(req)
    res.send("post")
})

app.use(function(error, req, res, next) {
    //res.status(500).render('500');
})  

db.initDatabase()
  .then(function () {
    server.listen(8080);
  })
  .catch(function (error) {
    console.log('Connecting to the database failed!');
  });