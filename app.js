const express = require("express");
const app = express();
const userController = require('./controller/usercontroller.js');
const PORT = 9000;

app.use('/', userController);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });