const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
 
const db = require('../data/database');
 
module.exports = () => {
   passport.use(
      new LocalStrategy(
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
               if (existingUser) {
                  // 해시비번을 비교
                  done(null, existingUser); //? 성공이면 done()의 2번째 인수에 선언

                  // const hashedPassword = await bcrypt.compare(password, existingUser.password);
                  // if (hashedPassword) {
                  //    done(null, existingUser); //? 성공이면 done()의 2번째 인수에 선언
                  // } else {
                  //    done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); //? 실패면 done()의 2번째 인수는 false로 주고 3번째 인수에 선언
                  // }
               }
               else { //DB에 아이디 조차 없음
                  done(null, false, { message: '가입되지 않은 회원입니다.' });
               }
            } catch (error) {
               console.error(error);
               done(error); //? done()의 첫번째 함수는 err용. 특별한것 없는 평소에는 null로 처리.
            }
         },
      ),
   );
};
