const passport = require('passport');
const local = require('./localStrategy'); // 로컬서버로 로그인할때
//const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할때
const db = require('../data/database');
 
module.exports = () => {
   //? req.login(user, ...) 가 실행되면, serializeUser가 실행된다.
   //? 즉 로그인 과정을 할때만 실행
   passport.serializeUser((user, done) => {
      // req.login(user, ...)의 user가 일로 와서 값을 이용할수 있는 것이다.
      done(null, user.id);
      // req.session객체에 어떤 데이터를 저장할 지 선택.
      // user.id만을 세션객체에 넣음. 사용자의 온갖 정보를 모두 들고있으면, 
      // 서버 자원낭비기 때문에 사용자 아이디만 저장 그리고 데이터를 deserializeUser애 전달함
      // 세션에는 { id: 3, 'connect.sid' : s%23842309482 } 가 저장됨
   });
 
   //? deserializeUser는 serializeUser()가 done하거나 passport.session()이 실행되면 실행된다.
   //? 즉, 서버 요청이 올때마다 항상 실행하여 로그인 유저 정보를 불러와 이용한다.
   passport.deserializeUser((id, done) => {

      db.getDb().collection('users').findOne({userId: id}) 
      .then(user => done(null, user)) //? done()이 되면 이제 다시 req.login(user, ...) 쪽으로 되돌아가 다음 미들웨어를 실행하게 된다.
      .catch(err => done(err));
   }); 
   local();
}