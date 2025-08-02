const workoutPlans = {};

exports.startWorkout = (req, res) => {
  //TODO: save user plan and set current index to 0
  res.status(200).json({ message: 'Workout plan received' });
};

exports.getCurrentMachine = (req, res) => {
  //TODO: return current machine in user’s plan
  res.status(200).json({ machine: 'placeholder' });
};

exports.advanceWorkout = (req, res) => {
  //TODO: increment index and return next machine
  res.status(200).json({ message: 'Advanced to next machine' });
};
