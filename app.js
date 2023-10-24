const express = require("express");
const app = express();
const { router: userRoute } = require('./controller/usercontroller');
const  workoutRoute  = require('./controller/workout_controller');
const PORT = 9000;
const bodyParser = require('body-parser');
const exercisesRoute = require('./routes/exerciseRoutes');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/exercises', exercisesRoute);
app.use('/workout', workoutRoute);
app.use('/', userRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});