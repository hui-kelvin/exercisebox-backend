const express = require("express");
const app = express();
const PORT = 9000;
const exercisesDAO = require('./repository/exercises_dao');






//   signInDao.getUsersWithUserName("proalexv").then((data) => {
//     console.log(data.Count);
// }).catch((err) => {
//     console.log('An Error Occurred!');
//     console.error(err);
// });

app.get("/exercises", (req, res) => {

  exercisesDAO.getExercises()
  .then((data) => {
    console.log(data);
    res.send(data);
  }).catch((err) => {
    console.log('An Error Occurred!');
    console.error(err);
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
