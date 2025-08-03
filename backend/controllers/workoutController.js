const queues = {};
const workoutPlans = {}; 
const path = require('path');
const fs = require('fs');

exports.createWorkoutPlan = (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  const filePath = path.join(__dirname, '../data/equipment.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading equipment.json:', err);
      return res.status(500).json({ error: "Could not load equipment data" });
    }

    try {
      const equipmentList = JSON.parse(data);
      const queue = equipmentList
        .filter(machine => machine.categories.includes(category))
        .map(machine => machine.name); // just send machine names for now

      res.status(200).json({ queue });
    } catch (parseError) {
      console.error('Error parsing equipment data:', parseError);
      return res.status(500).json({ error: "Failed to parse equipment data" });
    }
  });
};

exports.startWorkout = (req, res) => {
   const { userId, plan } = req.body;

  if (!userId || !Array.isArray(plan) || plan.length === 0) {
    return res.status(400).json({ error: 'Invalid workout plan or userId' });
  }

   workoutPlans[userId] = {
    plan,
    currentIndex: 0
  };

    const currentMachine = plan[0];
  if (!queues[currentMachine]) queues[currentMachine] = [];

  if (!queues[currentMachine].includes(userId)) {
    queues[currentMachine].push(userId);
  }

  res.status(200).json({ message: 'Workout started', currentMachine });
};

exports.getCurrentMachine = (req, res) => {
  const userId = req.params.userId;
  const workout = workoutPlans[userId];

  if (!workout) {
    return res.status(404).json({ error: 'No active workout for user' });
  }

  const machine = workout.plan[workout.currentIndex];
  res.status(200).json({ currentMachine: machine });
};

exports.advanceWorkout = (req, res) => {
 const { userId } = req.body;
  const workout = workoutPlans[userId];

  if (!workout) {
    return res.status(404).json({ error: 'No active workout for user' });
  }

  const currentMachine = workout.plan[workout.currentIndex];
  if (queues[currentMachine]) {
    queues[currentMachine] = queues[currentMachine].filter(id => id !== userId);
  }

  workout.currentIndex++;

  if (workout.currentIndex >= workout.plan.length) {
    delete workoutPlans[userId];
    return res.status(200).json({ message: 'Workout complete!' });
  }

  const nextMachine = workout.plan[workout.currentIndex];
  if (!queues[nextMachine]) queues[nextMachine] = [];
  if (!queues[nextMachine].includes(userId)) {
    queues[nextMachine].push(userId);
  }

  res.status(200).json({ message: 'Advanced to next machine', nextMachine });
};
