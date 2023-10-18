const express = require("express");
const app = express();
const userController = require('./controller/usercontroller.js');
const workoutController = require('./controller/workout_controller.js');
const PORT = 9000;

//app.use('/user', userController);

app.use('/workout', workoutController);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });