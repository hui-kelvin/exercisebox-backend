const jwt = require('jsonwebtoken');
const Promise = require('bluebird');



function createJWT(username, role) {
    return jwt.sign({
        username,
        role
    }, 'thisisanothersecret', {
        expiresIn: '1d'
    })
}
// (header + payload) sign with the secret -> signature "thisisasecret"

/**
 * The JWT will be sent to the client
 * When the client sends the JWT back to the server, the server needs to check if the JWT is valid
 * (header + payload + signature) -> we need to verify that the signature was generated using our secret
 * You cannot forge any of the information inside of the payload or header, becuase the server will know that it was forged
 */

jwt.verify = Promise.promisify(jwt.verify); // Turn jwt.verify into a function that returns a promise

// verify
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
        req.role = payload.role;

        // console.log(req.username);
        // console.log(req.role);

        console.log("TOKEN MIDDLE WARE APPROVED");
        next();
    }
    ).catch((err) => { console.log(err) });

}

function validateUsernameAndPassword(req, res, next) {
    const reqBody = req.body;

    if ((reqBody.username == null) || (reqBody.password == null)) {
        return res.status(400).json({ message: "There is no username and password property" });
    }
    else if ((reqBody.username == "") || (reqBody.password == "")) {
        return res.status(400).json({ message: 'You need to type in a username and password!' });
    }
    else {
        req.username = reqBody.username;
        req.password = reqBody.password;

        console.log("USERNAME AND PASSWORD MIDDLE WARE APPROVED");
        next();
    }
}

module.exports = {
    createJWT,
    verifyTokenAndReturnPayload,
    validateToken,
    validateUsernameAndPassword,
}