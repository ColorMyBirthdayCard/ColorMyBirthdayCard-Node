const path = require('path')

const express = require('express')
const cors = require('cors')
const session = require('express-session')
const mongodbStore = require('connect-mongodb-session')
const bodyParser = require('body-parser')

const db = require('./data/database')
const appRouter = require('./routes/router')

const app = express();

const MongoDBStore = mongodbStore(session)

const sessionStore = new MongoDBStore({
  uri: 'mongodb://jung:jung@54.176.26.102:27017/cards',
  collection: 'sessions'
});

const server = require('http').createServer(app);

app.use(cors())
app.use(bodyParser.json())
// app.use(express.urlencoded({extended: false}))

app.use(appRouter)  

db.initDatabase()
  .then(function () {
    server.listen(8080, function() {
        console.log("suceess")
    });
  })
  .catch(function (error) {
    console.log('Connecting to the database failed!');
  });