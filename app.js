const express = require("express");
const app = express();
const PORT = 9000;
const bodyParser = require('body-parser');
const exercisesRoute = require('./routes/exerciseRoutes');

app.use(bodyParser.json());
app.use('/exercises', exercisesRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });