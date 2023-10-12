const userDao = require('../repository/user_dao.js');

function addUser(user) {
    return userDao.addUser(user);
}

function getUser(username) {
    return userDao.getUser(username);
}

function updateByUsername(username, field, value) {
    return userDao.updateByUsername(username, field, value);
}

module.exports = { addUser, getUser, updateByUsername };