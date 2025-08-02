const queues = {};
const workoutPlans = {}; 

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
