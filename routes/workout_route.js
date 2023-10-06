const express = require('express');
const router = express.Router();
const jwtUtil = require('../utility/jwt_util');
const workoutService = require('../service/workout_service');
const { createLogger, transports, format} = require('winston');

// create the logger
const logger = createLogger({
    level: 'info', // this will log only messages with the level 'info' and above
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // log to the console
        new transports.File({ filename: 'exercisebox.log'}), // log to a file
    ]
})

//Autheticate Token
function authToken(req, res, next)
{
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];
    jwtUtil.verifyTokenAndReturnPayload(token)
        .then((payload) => {
            res.statusCode = 401;
            res.send({
                message: 'Token Authenticated'
            });
            next();
        })
        .catch((err) => {
            res.statusCode = 401;
            res.send({
                message: 'Failed to Authenticate Token',
                error: err
            });
        })
}
router.use(authToken);

router.get('/', (req, res) => { 
    const param = req.body;
    workoutService.getUserPlanner(param.username)
    .then((data) => {
        logger.info('Successful Retrieval by Employee!')
        res.send(data.Items);
    })
    .catch((err) => {
        logger.error(err);
    res.status(400).send({message: 'Failed to Retrieve Tickets!'});
    })
});


module.exports = router;