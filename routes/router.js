const express = require('express');
const bcrypt = require('bcryptjs')

const db = require('../data/database');
const router = express.Router();


router.get('/', async function(req, res) {
    const user = db.getDb().collection('session').findMany({})
    console.log(user)

    // res.send("<h1>session store</h1>")
})

router.post('/register', async function(req, res) {
    const userData = req.body;
    const userId = userData.userId;
    const password = userData.password;

    if(checkExistingUser(userId)) {
        return res.statusCode(404).send("sada")
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = {
        userId: userId,
        password: hashedPassword
    }
    await db.getDb().collection("user").insetOne(user)
    res.send("done login") //done
})

router.post('/login', async function(req, res) {
    passport.authenticate('local', (authError, user, info) => {

        // done(err)가 처리된 경우
        if (authError) {
           console.error(authError);
           return res.status(401)
        }
        //비번 일치 X or 존재 X user
        if (!user) {
           // done()의 3번째 인자 { message: '비밀번호가 일치하지 않습니다.' }가 실행
           return res.status(401).send(info.message);
        }
    
        //Login 성공
        return req.login(user, loginError => {
           //? loginError => 미들웨어는 passport/index.js의 passport.deserializeUser((id, done) => 가 done()이 되면 실행하게 된다.
           // 만일 done(err) 가 됬다면,
           if (loginError) {
              console.error(loginError);
              return res.status(401);
           }
           // done(null, user)로 로직이 성공적이라면, 세션에 사용자 정보를 저장해놔서 로그인 상태가 된다.

            const userInfor = {
                sessionId: req.sessionID,
                userId: req.session.passport.user
            }
            return res.send(userInfor);
        });
     })(req, res); //! 미들웨어 내의 미들웨어에는 콜백을 실행시키기위해 (req, res, next)를 붙인다.
});





module.exports = router