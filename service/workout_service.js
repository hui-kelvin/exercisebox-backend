
const workoutDao = require('../repository/workout_dao');

async function getUserPlanner(username)
{
    const result = workoutDao.getUserPlanner(username);
    return result;
}
function updateWeek(username, week)
{
    const result = workoutDao.updateWeek(username, week);
    return result;
}
function updateCompleted(username, completed)
{
    const result = workoutDao.updateCompleted(username, completed);
    return result;
}
module.exports = {
    getUserPlanner,
    updateWeek,
    updateCompleted
};