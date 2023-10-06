const express = require('express');
const jwtUtil = require('../utility/jwt_utils.js');
const bodyParser = require('body-parser');
const userService = require('../service/userservice.js');
const router = express.Router()
const bcrypt = require('bcrypt');



router.use(bodyParser.json());

const validateCredFields = (req, res, next) => {
    if(!req.body.username || !req.body.password){
        req.body.valid = false;
        next();
    }else{
        req.body.valid = true;
        next();
    }
}

router.post('/register',validateCredFields, async(req,res) => {
    const body = req.body;
    if(body.valid) {
        const { username, password } = body;
        const results = await userService.getUser(username);
        if(results.Items.length > 0) {
            res.statusCode = 400;
            res.send({message:'Username already exists, please choose another.'});
        } else {
            const newUser = new User(username,password);
            userDao.addUser(newUser)
                .then((data) => {
                    res.statusCode = 201;
                    res.send({message: "Successfully registered!"})
                })
                .catch((err) => {
                    res.statusCode = 400;
                    res.send({message: "Failed to register!"})
                })
        }
    }
})

router.post('/login',validateCredFields, async(req,res) => {
    const body = req.body;
    if(body.valid) {
        const { username, password } = body;
        const results = await userService.getUser(username);
        if(results.Items.length > 0) {
            const retrievedUser = results.Items[0];
            const passwordMatch = bcrypt.compareSync(password, retrievedUser.password);
            if(passwordMatch) {
                const token = jwtUtil.createJWT(retrievedUser.username, retrievedUser.role);
                res.statusCode = 202;
                res.send({
                    message:  `Successfully authenticated. Welcome ${retrievedUser.role}: ${retrievedUser.username}`,
                    token: token
                })
            } else {
                res.statusCode = 400;
                res.send({message: "Incorrect password."});
            }
        } else {
            res.statusCode = 400;
            res.send({message: "Account does not exist."});
        }
    }
})

router.put('/update/:username', async (req, res) => {
    const username = req.params.username;
    const { field, value } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];
    try {
        const payload = await jwtUtil.verifyTokenAndReturnPayload(token)
        if(payload.role === 'user'){
            if(username !== payload.username) {
                res.status = 403;
                res.send({message: 'Username and token does not match.'});
            } else {
                const update = await userService.updateByUsername(payload.username, field, value);
                res.statusCode = 200;
                res.send({message: `Successfully updated ${payload.username}'s ${field} to ${value}.`})
            }
        }else{
            res.statusCode = 403;
            res.send({message: `You are not a user, you are a ${payload.role}`})
        }
    } catch(err) {
        console.error(err);
        res.statusCode = 401;
        res.send({message: "Failed to Authenticate Token"})
    }

})