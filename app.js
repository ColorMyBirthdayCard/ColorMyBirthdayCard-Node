const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const session = require('express-session')


const db = require('./data/database')
const appRouter = require('./routes/router')
const passportConfig = require('./passport')

const app = express();
passportConfig()

const server = require('http').createServer(app);

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(cors(
	{
		origin:'http://117.17.198.45:3000',
		credentials: true
	}
));
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
   cookie: {
   //httpOnly: true, // javascript로 cookie에 접근하지 못하게 하는 옵션
      secure: false,
   }
  }));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장
app.use(appRouter)

db.initDatabase()
  .then(function () {
    server.listen(3030, function() {
        console.log("suceess")
    });
  })
  .catch(function (error) {
    console.log('Connecting to the database failed!');
  });
