const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport')

const db = require('../data/database');
const router = express.Router();


router.get('/',  function(req, res) {
    const user = db.getDb().collection('session').findMany({})
    console.log(user)

    // res.send("<h1>session store</h1>")
})

router.post('/signup', async function(req, res) {
    console.log('sing-up')
    // passport.authenticate('local-sinup', (authError, user, info) => {

    //     if(authError) {
    //         console.log('authoError')
    //         return res.status('401')
    //     }
        
    //     if(!user) {
    //         console.log("existing-id")
    //         return res.status('404').send(info.message)
    //     }

    //     return req.login(user, loginError => {
    //         //? loginError => 미들웨어는 passport/index.js의 passport.deserializeUser((id, done) => 가 done()이 되면 실행하게 된다.
    //         // 만일 done(err) 가 됬다면,
    //         if (loginError) {
    //            console.error(loginError);
    //            return res.status(401);
    //         }
    //         // done(null, user)로 로직이 성공적이라면, 세션에 사용자 정보를 저장해놔서 로그인 상태가 된다.
    //          console.log(req.session.passport.user)
    //          console.log()
    //      });
    //   })(req, res); 
    const { userId, password } = req.body
    //user Check 
    const existingUser = await db
    .getDb()
    .collection('users')
    .findOne({userId: userId}) 

    if(existingUser) {
        return res.status(401).send('이미 존재하는 회원')
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = {
        userId: userId,
        password: hashedPassword
    }
    let message
    await db.getDb().collection("users").insertOne(user, (err, res) => {
        if(err) {
            message ="database error"
        }
        message = "register success"
    })
    res.send(message)
})

router.post('/login', async function(req, res) {
	console.log("post")
    passport.authenticate('local', (authError, user, info) => {

        // done(err)가 처리된 경우
        if (authError) {
           console.error(authError);
           console.log('auth error')
           return res.status(401)
        }
        //비번 일치 X or 존재 X user
        if (!user) {
           // done()의 3번째 인자 { message: '비밀번호가 일치하지 않습니다.' }가 실행
           console.log("not exist user")
           return res.status(401).send(info.message);
        }
    
        //Login 성공
        return req.login(user, loginError => {
           //? loginError => 미들웨어는 passport/index.js의 passport.deserializeUser((id, done) => 가 done()이 되면 실행하게 된다.
           // 만일 done(err) 가 됬다면,
           if (loginError) {
              console.error(loginError);
              console.log("login.errr")
              return res.status(401);
           }
           // done(null, user)로 로직이 성공적이라면, 세션에 사용자 정보를 저장해놔서 로그인 상태가 된다.
            const userInfor = {
                sessionId: req.sessionID,
                userId: req.session.passport.user
	         }
            console.log("login success")

            return res.send(userInfor);
        });
     })(req, res); 
});

// router.get('/logout')

router.get('/test', function(req, res) {
	console.log(req.isAuthenticated())
	console.log(req.headers.cookie)
    if(req.isAuthenticated()){
    	return res.send(req.session.passport.user)
    } else {
	   return res.status(403).send("로그인 필요")
    }
})

module.exports = router
