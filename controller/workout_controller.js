const express = require('express');
const router = express.Router();
const jwtUtil = require('../utility/jwt_utils');
const workoutService = require('../service/workout_service');
const { createLogger, transports, format} = require('winston');

const bodyParser = require('body-parser');
router.use(bodyParser.json());

//create the logger
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
            res.statusCode = 200;
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
//router.use(authToken);

router.get('/', (req, res) => { 
    const {username} = req.query;
    workoutService.getAllUserPlanners(username)
    .then((data) => {
        logger.info('Successful Retrieval of Planner!')
        res.send(data.Items);
    })
    .catch((err) => {
        logger.error(err);
        res.status(400).send({message: 'Failed to Retrieve Planner!',
                                error: err});
    })
});
router.get('/plan', (req, res) => { 
    const {username, date} = req.query
    workoutService.getUserPlanner(username, new Date(date))
    .then((data) => {
        logger.info('Successful Retrieval of Planner!')
        res.send(data.Item);
    })
    .catch((err) => {
        logger.error(err);
        res.status(400).send({message: 'Failed to Retrieve Planner!',
                                error: err});
    })
});
router.post('/week', (req, res) => { 
   
    const {username, date} = req.query;
    const {week, completed, refresh_token} = req.body;
    workoutService.addPlanner(username, new Date(date), week, completed, refresh_token)
        .then((data) => {
            logger.info('Successfully Added Planner!')
            res.status(200).send({message: 'Successfully Added Planner!'});
        })
        .catch((err) => {
        logger.error(err);
        res.status(400).send({message: 'Failed to Add Planner!',
                                error: err});
        })
       
   
});

router.put('/update', (req, res) => { 
    
    const {username, date} = req.query;
    const {week, completed, refresh_token} = req.body;
    workoutService.updatePlanner(username, new Date(date), week, completed, refresh_token)
        .then((data) => {
            logger.info('Successfully Updated Planner!')
            res.status(200).send({message: 'Successfully Updated Planner!'});
        })
        .catch((err) => {
            logger.error(err);
            res.status(400).send({message: 'Failed to Update Planner!',
                                    error: err});
        })
    
});
router.delete('/delete', (req, res) => { 
    
    const {username, date} = req.query;
    const {eventID, refresh_token} = req.body;
    workoutService.deleteEvent(username, new Date(date), eventID, refresh_token)
    .then((data) => {
        logger.info('Successfully Deleted Planner!')
        res.status(200).send({message: 'Successfully Deleted Planner!'});
    })
    .catch((err) => {
        logger.error(err);
        res.status(400).send({message: 'Failed to Delete Planner!',
                                error: err});
    })
});

module.exports = router;