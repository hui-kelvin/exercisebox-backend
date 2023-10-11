
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
function addPlanner(username, date, week)
{
    if(!week)
    {
        throw new Error('No Exercises Planned')
    }else{
        const completed = false;
        const result = workoutDao.addPlanner(username, beginningOfWeek(date), week, completed);
        return result;
    }
    
}
function updatePlanner(username, date, week)
{
    const result = workoutDao.updatePlanner(username, beginningOfWeek(date), week);
    return result;
}
function deletePlanner(username, date)
{
    const result = workoutDao.deletePlanner(username, beginningOfWeek(date));
    return result;
}
module.exports = {
    getUserPlanner,
    getAllUserPlanners,
    addPlanner,
    updatePlanner,
    deletePlanner
};