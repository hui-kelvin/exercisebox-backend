const bcrypt = require('bcrypt');
const { application } = require('express');

class User{
    constructor(username,password,gender,weight,height) {
        this.username = username;
        this.password = this.setPassword(password);
        this.gender = gender;
        this.weight = weight;
        this.height = height;
        this.role = "user";
    }

    setPassword(password) {
        const salt = 10;
        return bcrypt.hashSync(password, salt);
    }
}

module.exports = User;