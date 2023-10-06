const bcrypt = require('bcrypt');
const { application } = require('express');

class User{
    constructor(username,password,gender,weight,height) {
        this.username = username;
        this.password = password;
        this.gender = gender;
        this.weight = weight;
        this.height = height;
        this.role = "user";
    }
}

module.exports = User;