const express = require("express");
const app = express();
const userController = require('./controller/usercontroller.js');
const PORT = 9000;
const bodyParser = require('body-parser');
const exercisesRoute = require('./routes/exerciseRoutes');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
app.use('/exercises', exercisesRoute);
app.use('/', userController);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});