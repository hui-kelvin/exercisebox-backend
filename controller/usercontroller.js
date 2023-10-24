const express = require('express');
const jwtUtil = require('../utility/jwt_utils.js');
const bodyParser = require('body-parser');
const userService = require('../service/userservice.js');
const router = express.Router()
const bcrypt = require('bcrypt');
const User = require('../models/user');
const userDao = require('../repository/user_dao');
const middleWare = require('../utility/middleWare');

router.use(bodyParser.json());

const validateCredFields = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        req.body.valid = false;
        next();
    } else {
        req.body.valid = true;
        next();
    }
}

router.post('/register', validateCredFields, async (req, res) => {
    const body = req.body;
    if (body.valid) {
        const { username, password, gender, weight, height } = body;
        const results = await userService.getUser(username);
        if (results.Items.length > 0) {
            res.status(400);
            res.send({ message: 'Username already exists, please choose another.' });
        } else {
            const newUser = new User(username, password, gender, weight, height);
            userDao.addUser(newUser)
                .then((data) => {
                    res.status(201);
                    res.send({ message: "Successfully registered!" })
                })
                .catch((err) => {
                    res.status(400);
                    res.send({ message: "Failed to register!" })
                })
        }
    } else {
        res.status(400);
        res.send({ message: "Please Enter At Least Both a Username and a Password." });
    }
})

router.post('/login', validateCredFields, async (req, res) => {
    const body = req.body;
    if (body.valid) {
        const { username, password } = body;
        const results = await userService.getUser(username);
        if (results.Items.length > 0) {
            const retrievedUser = results.Items[0];
            const passwordMatch = bcrypt.compareSync(password, retrievedUser.password);
            if (passwordMatch) {
                let token;
                try {
                    token = jwtUtil.createJWT(retrievedUser.username, retrievedUser.role);
                    res.status(202);
                    res.send({
                        message: `Successfully authenticated. Welcome ${retrievedUser.role}: ${retrievedUser.username}`,
                        username: retrievedUser.username,
                        token: token
                    })
                } catch (err) {
                    res.status(400);
                    res.send({ message: `${err.stack}` });
                }
            } else {
                res.status(400);
                res.send({ message: "Incorrect password." });
            }
        } else {
            res.status(400);
            res.send({ message: "Account does not exist." });
        }
    } else {
        res.status(400);
        res.send({ message: "Please Enter Both a Username and Password." });
    }
})

router.put('/update/:username', async (req, res) => {
    const username = req.params.username;
    const { field, value } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];
    try {
        const payload = await jwtUtil.verifyTokenAndReturnPayload(token)
        if (payload.role === 'user') {
            if (username !== payload.username) {
                res.status = 403;
                res.send({ message: 'Username and token does not match.' });
            } else {
                const update = await userService.updateByUsername(payload.username, field, value);
                res.statusCode = 200;
                res.send({ message: `Successfully updated ${payload.username}'s ${field} to ${value}.` })
            }
        } else {
            res.statusCode = 403;
            res.send({ message: `You are not a user, you are a ${payload.role}` })
        }
    } catch (err) {
        console.error(err);
        res.statusCode = 401;
        res.send({ message: "Failed to Authenticate Token" })
    }

})

router.get('/', (req, res) => {
    res.send("hello world!");
});

// middleWare.validateToken,
router.put('/user', middleWare.validateToken, async (req, res) => {

    // console.log(req.headers);

    // const authHeader = req.headers.authorization || req.headers.Authorization;

    // if (!authHeader.startsWith("Bearer ")) {
    //     return res.status(400).json({ message: "There is no token in header" });
    // }

    // const token = authHeader.split(" ")[1];

    // const token = req.body.token;
    const reqUsername = req.username;

    // req.header.authorization = token;

    // console.log("THERE IS A TOKEN: " + token);


    userDao.getUser(reqUsername)
        .then((results) => {
            console.log(results);
            if (results.Items.length > 0) {
                res.statusCode = 200
                res.send({ userData: results.Items[0] });
            }
        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 400
            res.send({ message: "Failed to get user." });
        });

    // jwtUtil.verifyTokenAndReturnPayload(token).then((payload) => {
    //     userDao.getUser(reqUsername)
    //         .then((results) => {
    //             console.log(results);
    //             if (results.Items.length > 0) {
    //                 res.statusCode = 200
    //                 res.send({ userData: results.Items[0] });
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             res.statusCode = 400
    //             res.send({ message: "Failed to get user." });
    //         });
    // }
    // ).catch((err) => {
    //     console.log(err);
    //     res.statusCode = 400
    //     res.send({ message: "Invalid token" });
    // });

    // try {
    //     // if (token == null) {
    //     //     res.statusCode = 400
    //     //     res.send({ message: "No token given" });
    //     // }
    //     // else if (token != "") {
    //     //     res.statusCode = 400
    //     //     res.send({ message: "Empty token" });
    //     // }
    //     /*else*/ {
    //         const results = await userDao.getUser(reqUsername);
    //         console.log(results);
    //         if (results.Items.length > 0) {
    //             res.statusCode = 200
    //             res.send({ userData: results.Items[0] });
    //         }
    //         else {
    //             res.statusCode = 400
    //             res.send({ message: "Account does not exist." });
    //         }
    //     }
    // }
    // catch (err) {
    //     console.log(err);
    //     res.statusCode = 400
    //     res.send({ message: "Failed to get user." });
    // }

});

router.put('/update', middleWare.validateToken, async (req, res) => {

    // const token = req.body.token;

    const username = req.username;
    const password = req.body.password;
    const gender = req.body.gender;
    const weight = req.body.weight;
    const height = req.body.height;
    const aboutme = req.body.aboutme;
    const goals = req.body.goals

    userDao.getUser(username)
        .then((results) => {
            console.log(results);
            if (results.Items.length > 0) {
                if (password != "" && password != null) {
                    const salt = 10;

                    const newPassword = bcrypt.hashSync(password, salt);

                    userDao.updateByUsername(username, "password", newPassword);
                }
                if (gender != "" && gender != null) {
                    userDao.updateByUsername(username, "gender", gender);
                }
                if (weight != "" && weight != null) {
                    userDao.updateByUsername(username, "weight", weight);
                }
                if (height != "" && height != null) {
                    userDao.updateByUsername(username, "height", height);
                }
                if (aboutme != "" && aboutme != null) {
                    userDao.updateByUsername(username, "aboutme", aboutme);
                }
                if (goals != "" && goals != null) {
                    userDao.updateByUsername(username, "goals", goals);
                }
                res.statusCode = 200
                res.send({ userData: results.Items[0] });
            }
        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 400
            res.send({ message: "Invalid token" });
        });

    // jwtUtil.verifyTokenAndReturnPayload(token).then((payload) => {
    //     userDao.getUser(username)
    //         .then((results) => {
    //             console.log(results);
    //             if (results.Items.length > 0) {
    //                 if (password != "") {
    //                     userDao.updateByUsername(username, "password", newPassword);
    //                 }
    //                 if (gender != "") {
    //                     userDao.updateByUsername(username, "gender", gender);
    //                 }
    //                 if (weight != "") {
    //                     userDao.updateByUsername(username, "weight", weight);
    //                 }
    //                 if (height != "") {
    //                     userDao.updateByUsername(username, "height", height);
    //                 }
    //                 if (aboutme != "") {
    //                     userDao.updateByUsername(username, "aboutme", aboutme);
    //                 }
    //                 if (goals != "") {
    //                     userDao.updateByUsername(username, "goals", goals);
    //                 }
    //                 res.statusCode = 200
    //                 res.send({ userData: results.Items[0] });
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             res.statusCode = 400
    //             res.send({ message: "Invalid token" });
    //         });
    // }
    // ).catch((err) => {
    //     console.log(err);
    //     res.statusCode = 400
    //     res.send({ message: "Invalid token" });
    // });

    // try {
    //     const results = await userDao.getUser(username);
    //     // console.log(results)
    //     if (results.Items.length > 0) {
    //         if (password != "") {
    //             userDao.updateByUsername(username, "password", newPassword);
    //         }
    //         if (gender != "") {
    //             userDao.updateByUsername(username, "gender", gender);
    //         }
    //         if (weight != "") {
    //             userDao.updateByUsername(username, "weight", weight);
    //         }
    //         if (height != "") {
    //             userDao.updateByUsername(username, "height", height);
    //         }
    //         if (aboutme != "") {
    //             userDao.updateByUsername(username, "aboutme", aboutme);
    //         }
    //         if (goals != "") {
    //             userDao.updateByUsername(username, "goals", goals);
    //         }
    //         res.statusCode = 200
    //         res.send({ userData: results.Items[0] });
    //     }
    //     else {
    //         res.statusCode = 400
    //         res.send({ message: "Account does not exist." });
    //     }
    // }
    // catch (err) {
    //     console.log(err);
    //     res.statusCode = 400
    //     res.send({ message: "Failed to get user." });
    // }

})

//  VVV OLD UPDATE/PUT FUNCTIONS VVV

// router.put('/edit/password', middleWare.validateToken, middleWare.validateUser, middleWare.validatePassword, (req, res) => {
//     // res.send({ userN: req.body.username, passW: req.body.password });
//     const reqUsername = req.username;
//     const reqPassword = req.body.password;
//     const salt = 10;

//     const newPassword = bcrypt.hashSync(reqPassword, salt);

//     userDao.updateByUsername(reqUsername, "password", newPassword)
//         .then((data) => {
//             // console.log(data);
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: "updated password." }));
//         })
//         .catch((err) => {
//             console.log(err);
//             res.writeHead(400, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: "Failed to update password." }));
//         });
// });

// router.put('/edit/gender', middleWare.validateToken, middleWare.validateUser, middleWare.validateGender, (req, res) => {
//     // res.send({ userN: req.body.username, passW: req.body.password });
//     const reqUsername = req.username;
//     const reqGender = req.body.gender;

//     userDao.updateByUsername(reqUsername, "gender", reqGender)
//         .then((data) => {
//             // console.log(data);
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: "updated gender." }));
//         })
//         .catch((err) => {
//             console.log(err);
//             res.writeHead(400, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: "Failed to update gender." }));
//         });
// });

// router.put('/edit/height', middleWare.validateToken, middleWare.validateUser, middleWare.validateHeight, (req, res) => {
//     // res.send({ userN: req.body.username, passW: req.body.password });
//     const reqUsername = req.username;
//     const reqHeight = req.body.height;

//     userDao.updateByUsername(reqUsername, "height", reqHeight)
//         .then((data) => {
//             // console.log(data);
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: "updated height." }));
//         })
//         .catch((err) => {
//             console.log(err);
//             res.writeHead(400, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: "Failed to update height." }));
//         });
// });

// router.put('/edit/weight', middleWare.validateToken, middleWare.validateUser, middleWare.validateWeight, (req, res) => {
//     // res.send({ userN: req.body.username, passW: req.body.password });
//     const reqUsername = req.username;
//     const reqWeight = req.body.weight;

//     userDao.updateByUsername(reqUsername, "weight", reqWeight)
//         .then((data) => {
//             // console.log(data);
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: "updated weight." }));
//         })
//         .catch((err) => {
//             console.log(err);
//             res.writeHead(400, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: "Failed to update weight." }));
//         });
// });

//  ^^^ OLD UPDATE/PUT FUNCTIONS ^^^

module.exports = { router, validateCredFields };