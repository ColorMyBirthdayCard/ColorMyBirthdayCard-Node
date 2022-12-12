const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport')
const mongodb = require('mongodb');

const db = require('../data/database');
const router = express.Router();
const ObjectId = mongodb.ObjectId;



router.post('/api/v1/checkId', async function(req, res) {
    const { userId } = req.body
    //user Check 
    const existingUser = await db
    .getDb()
    .collection('users')
    .findOne({userId: userId}) 
    console.log('1')
    if(existingUser) {
        return res.status(401).send({message: '이미 존재하는 회원'})
    } 
    else {
        return res.send({message: "가능한 아이디"})
    }
})

router.post('/api/v1/signup', async function(req, res) {
    console.log('sing-up')
    const { userId, password, userName, userBirthday } = req.body
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
        password: hashedPassword,
        userName: userName,
        userBirthday: userBirthday,
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

router.post('/api/v1/login', async function(req, res) {
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

router.get('/api/v1/home/:id', async function(req, res) {
    const userId = req.params.id
    const cardList = await db
    .getDb()
    .collection('cards')
    .find({userId: new ObjectId(userId)}).toArray();

    console.log(cardList)
    return res.send(cardList)
    // 한번에 보내버리기!!!! 좋아유 
})
 
router.post('/api/v1/card/:id', async function(req, res) {
    const userId = req.params.id
    const {writerId, cakeIndex, content, letterIndex} = req.body

    const newLetter = {
        userId : new ObjectId(userId),
        writerId : writerId,
        cakeIndex: cakeIndex,
        content : content,
        letterIndex : letterIndex,
        date: new Date()
    }

    await db
        .getDb()
        .collection('cards')
        .insertOne(newLetter, (err, res) => {
            if(err) {
                res.send({message: 'db error'})
            }
            res.send({message: '저장 서공'})
        })
})

module.exports = router
