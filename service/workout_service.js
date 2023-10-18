
const workoutDao = require('../repository/workout_dao');

function beginningOfWeek(date)
{
    if(date.getDay()>0)
    {
        date.setDate(date.getDate()-date.getDay());
    }
    return date;
}
async function getUserPlanner(username, date)
{
    const result = workoutDao.getUserPlanner(username, beginningOfWeek(date));
    return result;
}
async function getAllUserPlanners(username)
{
    const result = workoutDao.getAllUserPlanners(username);
    return result;
}

async function addPlanner(username, date, week, completed, refresh_token)
{
    if(!week)
    {
        throw new Error('No Exercises Planned')
    }else{
        const result = workoutDao.addPlanner(username, beginningOfWeek(date), week, completed, refresh_token);
        return result;
    }
    
}
async function updatePlanner(username, date, week, refresh_token, completed)
{
    const result = workoutDao.updatePlanner(username, beginningOfWeek(date), week, refresh_token, completed);
    return result;
}
function deleteEvent(username, date, eventID, refresh_token)
{
    const result = workoutDao.deleteEvent(username, beginningOfWeek(date),eventID, refresh_token);
    return result;
}
module.exports = {
    getUserPlanner,
    getAllUserPlanners,
    addPlanner,
    updatePlanner,
    deleteEvent
};