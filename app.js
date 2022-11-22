const path = require('path')

const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser')



const cors = require('cors')
const session = require('express-session')
// const mongodbStore = require('connect-mongodb-session')
// const bodyParser = require('body-parser')

const db = require('./data/database')
const appRouter = require('./routes/router')
const passportConfig = require('./passport')


const app = express();

// const MongoDBStore = mongodbStore(session)

// const sessionStore = new MongoDBStore({
//   uri: 'mongodb://jung:jung@54.176.26.102:27017/cards',
//   collection: 'sessions'
// });
passportConfig()
const server = require('http').createServer(app);


app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }));

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장

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