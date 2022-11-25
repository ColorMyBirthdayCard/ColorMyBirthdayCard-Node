const passport = require('passport');
const local = require('./localStrategy'); // 로컬서버로 로그인할때
//const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할때
const db = require('../data/database');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

module.exports = () => {
   //? req.login(user, ...) 가 실행되면, serializeUser가 실행된다.
   //? 즉 로그인 과정을 할때만 실행
   passport.serializeUser((user, done) => {
      console.log('serial')
	   // req.login(user, ...)의 user가 일로 와서 값을 이용할수 있는 것이다.
      done(null, user._id);
      // 세션에는 { id: 3, 'connect.sid' : s%23842309482 } 가 저장됨
   });
 
   //? deserializeUser는 serializeUser()가 done하거나 passport.session()이 실행되면 실행된다.
   //? 즉, 서버 요청이 올때마다 항상 실행하여 로그인 유저 정보를 불러와 이용한다.
   passport.deserializeUser((id, done) => {
console.log('desearial')
	   const userId = new ObjectId(id);
      db.getDb().collection('users').findOne({_id: userId}) 
      .then(user => done(null, user)) //? done()이 되면 이제 다시 req.login(user, ...) 쪽으로 되돌아가 다음 미들웨어를 실행하게 된다.
      .catch(err => done(err));
   }); 
   local();
}
