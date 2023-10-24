const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

jwt.verify = Promise.promisify(jwt.verify); // Turn jwt.verify into a function that returns a promise

function verifyTokenAndReturnPayload(token) {
    return jwt.verify(token, 'thisisanothersecret');
}

function validateToken(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ message: "There is no token in header" });
    }

    const token = authHeader.split(" ")[1];

    verifyTokenAndReturnPayload(token).then((payload) => {

        req.username = payload.username;
        // req.role = payload.role;

        // console.log(req.username);
        // console.log(req.role);

        console.log("TOKEN MIDDLE WARE APPROVED");
        next();
    }
    ).catch((err) => { console.log(err) });

}

function validatePassword(req, res, next) {
    const reqBody = req.body;

    if ((reqBody.password == null)) {
        return res.status(400).json({ message: "There is no password property" });
    }
    else if ((reqBody.password == "")) {
        return res.status(400).json({ message: 'You need to type in a password!' });
    }
    else {
        req.password = reqBody.password;

        console.log("PASSWORD MIDDLE WARE APPROVED");
        next();
    }
}

function validateGender(req, res, next) {
    const reqBody = req.body;

    if ((reqBody.gender == null)) {
        return res.status(400).json({ message: "There is no gender property" });
    }
    else if ((reqBody.gender == "")) {
        return res.status(400).json({ message: 'You need to type in a gender!' });
    }
    else {
        req.gender = reqBody.gender;

        console.log("GENDER MIDDLE WARE APPROVED");
        next();
    }
}

function validateHeight(req, res, next) {
    const reqBody = req.body;

    if ((reqBody.height == null)) {
        return res.status(400).json({ message: "There is no height property" });
    }
    else if ((reqBody.height == "")) {
        return res.status(400).json({ message: 'You need to type in a height!' });
    }
    else {
        req.height = reqBody.height;

        console.log("HEIGHT MIDDLE WARE APPROVED");
        next();
    }
}

function validateWeight(req, res, next) {
    const reqBody = req.body;

    if ((reqBody.weight == null)) {
        return res.status(400).json({ message: "There is no weight property" });
    }
    else if ((reqBody.weight == "")) {
        return res.status(400).json({ message: 'You need to type in a weight!' });
    }
    else {
        req.weight = reqBody.weight;

        console.log("WEIGHT MIDDLE WARE APPROVED");
        next();
    }
}

function validateUser(req, res, next) {
    // const reqBody = req.body;
    const reqRole = req.role

    if (!reqRole) {
        return res.status(400).json({ message: 'You have no role.' });
    }
    else if (reqRole === 'user') {
        console.log("USER MIDDLE WARE APPROVED");
        next();
    }
    else {
        return res.status(400).json({ message: `You are not an user, you are a/an ${reqRole}` });
    }
}

module.exports = {
    validateToken,
    validatePassword,
    validateUser,
    validateGender,
    validateHeight,
    validateWeight
}