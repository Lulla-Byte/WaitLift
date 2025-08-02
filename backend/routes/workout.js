const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// start a new workout plan
router.post('/start', workoutController.startWorkout);

// get current machine in plan
router.get('/current/:userId', workoutController.getCurrentMachine);

// advance to next machine
router.post('/advance', workoutController.advanceWorkout);

module.exports = router;