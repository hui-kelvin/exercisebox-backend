const express = require("express");
const app = express();
const PORT = 9000;

const dao = require('./repository/user_dao');
const util = require('./utility/jwt_utils');

const bodyParser = require('body-parser');

app.use(bodyParser.json());

// (GENERAL FEATURE): Test
// GET request for testing connection
app.get('/', (res, req) => {
  req.send("hello world");
  console.log("hello world");
})

// (GENERAL FEATURE): Show all users
// GET request for all users
app.get('/users', (req, res) => {
  dao.retrieveList()
    .then((data) => {
      // console.log(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Now displaying users.", data }));
    })
    .catch((err) => {
      console.log(err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Failed to retrieve users.", data }));
    });
});

// (GENERAL FEATURE): Login a user
// POST request for logging in 
app.post('/login', util.validateUsernameAndPassword, (req, res) => {

  console.log("LOGIN REACHED");

  dao.getUser(req.username)
    .then((userNameData) => {
      console.log(userNameData);
      if (userNameData.Items[0].password == req.password) {
        const token = util.createJWT(userNameData.Items[0].username, userNameData.Items[0].role)
        res.writeHead(200, { 'Content-Type': 'application/json', 'User-Logged-In': `${userNameData.Items[0].username}`, 'Role': `${userNameData.Items[0].role}` });
        res.end(JSON.stringify({ message: `Successfully Authenticated, Welcome ${userNameData.Items[0].username}`, role: userNameData.Items[0].role, token: token }));
      }
      else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "User with that password does not exist" }));
      }
    })
    .catch((err) => {
      console.log(err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Failed to get users." }));
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});