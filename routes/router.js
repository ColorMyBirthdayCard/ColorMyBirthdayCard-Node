const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport')
const mongodb = require('mongodb');

const db = require('../data/database');
const router = express.Router();
const ObjectId = mongodb.ObjectId;


function isValidObjectId(id){
    
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id) {
            return true;
        }
        return false;
    }
    return false;
}

router.post('/api/v1/checkId', async function(req, res) {
    const { userId } = req.body
    //user Check 
    try {
        const existingUser = await db
        .getDb()
        .collection('users')
        .findOne({userId: userId}, (err, res) => {
            if (err) throw err
        }) 
        if(existingUser) {
            return res.status(401).send({message: '이미 존재하는 회원'})
        } 
        else {
            return res.send({message: "가능한 아이디"})
        }
    }
    catch {
        res.status(500).send({message: e})
    }


})

router.post('/api/v1/signup', async function(req, res) {
    console.log('sing-up')
    const { userId, password, name, birthday } = req.body
    //user Check 
    try {
    const existingUser = await db
    .getDb()
    .collection('users')
    .findOne({userId: userId}, (err, res) => {
        if(err) {
            throw err
        }
    }) 
    
    if(!existingUser) {
        return res.status(401).send({message: '이미 존재하는 회원'})
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = {
        userId: userId,
        password: hashedPassword,
        name: name,
        birthday: birthday,
    }
    await db.getDb().collection("users").insertOne(user, (err, res) => {
        if(err) {
            throw err
        }
    })

    res.send({message: "Signup Success"})
    } catch (e) {
        res.status(500).send({message: e})
    }
})

router.post('/api/v1/login', async function(req, res) {
	console.log("post")
    passport.authenticate('local', (authError, user, info) => {

        // done(err)가 처리된 경우(DB 오류)
        if (authError) {
           console.error(authError);
           console.log('auth error')
           return res.status(500).send({message: authError})
        }
        //비번 일치 X or 존재 X user
        if (!user) {
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
              return res.status(500);
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
    
    if(!isValidObjectId(userId)) {
        return res.status(404).send({message: "user not exist"})
    }
    
    try {
        const cardList = await db
        .getDb()
        .collection('cards')
        .find({userId: new ObjectId(userId)}, (err, res) => {
            if (err) throw err
        })
        .toArray();

        console.log("cardList")

        const userInfo = await db
        .getDb()
        .collection('users')
        .findOne({_id: new ObjectId(userId)}, (err, res) => {
            if(err) throw err
        })
        if(!userInfo) {
            return res.status(404).send({message: "user not exist"})
        }

        return res.send({letter: cardList, name: userInfo.name, birthday: userInfo.birthday})
    } catch(e) {
        return res.status(500).send({message: e})
    }
})
 
router.post('/api/v1/card/:id', async function(req, res) {
    const userId = req.params.id
    
    if(!isValidObjectId(userId)) {
        return res.status(404).send({message: "user not exist"})
    }
    const {writerId, cakeIndex, content, letterIndex} = req.body

    const newLetter = {
        userId : new ObjectId(userId),
        writerId : writerId,
        cakeIndex: cakeIndex,
        content : content,
        letterIndex : letterIndex,
        date: new Date()
    }
    try {
        await db
        .getDb()
        .collection('cards')
        .insertOne(newLetter, (err, res) => {
            if(err) throw err
        })
        res.send('card save success')
    } catch(e) {
        res.status(500).send('database error')
    }
})

module.exports = router
