const { Router } = require('express');
const exerciseService = require('../services/exerciseService');

const router = Router();

router.get("/", async (req, res) => {
    const params = req.query;

    try {
        const result = await exerciseService.getExercises(params);
        res.send(result);
    } catch(err) {
        res.send({ message: `${err.stack}` });
    }
})

module.exports = router;