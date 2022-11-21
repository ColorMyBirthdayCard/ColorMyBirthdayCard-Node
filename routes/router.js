const express = require('express');
const bcrypt = require('bcryptjs')

const db = require('../data/database');
const session = require('express-session');

const router = express.Router();

async function checkExistingUser(userId) {
    const existingUser = await db
    .getDb()
    .collection('users')
    .findOne({userId: userId})    //status : existing user 

    return existingUser
}

router.get('/', async function(res, req) {
    const user = db.getDb().collection('session').findMany({})
    console.log(user)

    // res.send("<h1>session store</h1>")
})

router.post('/register', async function(res, req) {
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

router.post('/login', async function(res, req) {
    console.log("post!----------")
    console.log(req)
    console.log(req.params)
    if(req.body) {
            console.log("errrrr");
    } else {
            console.log("undefined");
    }
    const { userId, password } = req.body

    try {
      if(!userId.valid()) throw new Error("userId invalid")
      if(!password.valid()) throw new Error("password invalid")
    } catch(err) {
        if(err) {
            res.status(406).json({message: err.message})
            return
        }
    }

    console.log(userId)

    const existingUser = await db
    .getDb()
    .collection('users')
    .findOne({userId: userId, password: password})
       //status : existing user 
    console.log("111")

    if(!existingUser) {
        res.status(401).json({message: err.message});
        return;
    }
    req.session.user = { id: existingUser._id, id: existingUser.userId}
    req.session.isAuthentication = true;
    console.log("222")

    req.session.save(function() {
        const userInformation = {
            data: {
                sessionId: req.sessionId,
                memberId: existingUser._id
            }
        }
        res.send(userInformation)
        //Json : sessionId + memberId
    })
    console.log("333")

})





module.exports = router