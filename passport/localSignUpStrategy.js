const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
 
const db = require('../data/database');
 
module.exports = () => {

   passport.use('local-sinup', 
      new LocalStrategy (
      {
         usernameField: 'userId', // req.body.userId
         passwordField: 'password', // req.body.password
   // session: true
     },
      //* 콜백함수의  email과 password는 위에서 설정한 필드이다. 위에서 객체가 전송되면 콜백이 실행된다.
      async (userId, password, done) => {
         try {
            // 가입된 회원인지 아닌지 확인
            const existingUser = await db
            .getDb()
            .collection('users')
            .findOne({userId: userId})
            // 만일 가입된 회원이면
            if (existingUser) { // 이미존재 -> 
               done(null, false, { message: '존재하는 아이디'})
            }
            else { //DB에 아이디 조차 없음
               //db 저자ㅇ!

               const hashedPassword = await bcrypt.hash(password, 12);
    
               const user = {
                  userId: userId,
                  password: hashedPassword
               }
               await db.getDb().collection("user").insetOne(user, (err, res) => {
                  if(err) {
                     done(null, false, {message: "Database error"})
                  }
                  done(null, user);
               })
            }
         } catch (error) {
            console.error(error);
            done(error); //? done()의 첫번째 함수는 err용. 특별한것 없는 평소에는 null로 처리.
         }
      },
      )
   )
};

