const express = require('express');
const router = express.Router();
const jwtUtil = require('../utility/jwt_utils');
const workoutService = require('../service/workout_service');

const bodyParser = require('body-parser');
router.use(bodyParser.json());

function authToken(req, res, next)
{
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];
    jwtUtil.verifyTokenAndReturnPayload(token)
        .then((payload) => {
            const {username} = req.query;
            if(payload.username === username){
                next();
            }else{
                res.statusCode = 401;
                res.send({
                    message: `Username does not match!`
                });
            }
        })
        .catch((err) => {
            res.statusCode = 401;
            res.send({
                message: "Failed to Authenticate Token!"
            });
        })
}
router.use(authToken);


router.get('/', (req, res) => { 
    const {username} = req.query;
    workoutService.getAllUserPlanners(username)
    .then((data) => {
        const exercisesData = data.Items.map(item => item.exercises);
        res.send(exercisesData);
    })
    .catch((err) => {
        res.status(400).send({message: 'Failed to Retrieve Planner!'});
    })
});

router.post('/week', (req, res) => { 
    const {username} = req.query;
    const {exercises} = req.body;
    
    workoutService.addPlanner(username, exercises)
        .then((data) => {
            res.status(200).send({message: 'Successfully Added Planner!'});
        })
        .catch((err) => {
        res.status(400).send({message: 'Failed to Add Planner!'});
        })
       
   
});


router.put('/delete', (req, res) => { 
    
    const {username} = req.query;
    const {exercises} = req.body;
    workoutService.deleteEvent(username, exercises)
    .then((data) => {
        res.status(200).send({message: 'Successfully Deleted Planner!'});
    })
    .catch((err) => {
        res.status(400).send({message: 'Failed to Delete Planner!'});
    })
});

module.exports = router;