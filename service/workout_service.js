
const workoutDao = require('../repository/workout_dao');

async function getUserPlanner(username, date)
{
    const result = workoutDao.getUserPlanner(username, date);
    return result;
}
async function getAllUserPlanners(username)
{
    const result = workoutDao.getAllUserPlanners(username);
    return result;
}

async function addPlanner(username, newWorkout)
{
    if(!newWorkout)
    {
        throw new Error('No Exercises Planned')
    }else{
        const result = workoutDao.addPlanner(username, newWorkout);
        return result;
    }
    
}

function deleteEvent(username, deletedWorkout)
{
    const result = workoutDao.deleteEvent(username, deletedWorkout);
    return result;
}
module.exports = {
    getUserPlanner,
    getAllUserPlanners,
    addPlanner,
    deleteEvent
};