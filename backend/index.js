const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const workoutRoutes = require('./routes/workout');
app.use('/workout', workoutRoutes);

const queueRoutes = require('./routes/queue');
app.use('/queue', queueRoutes);

app.get('/equipment/status', (req, res) => {
  // exmaples of equipment to add to later
  res.status(200).json({ treadmill: 'available', squatRack: 'in-use' });
});

if (require.main === module) {
  app.listen(port, () => console.log(`WaitLift backend running on port ${port}`));
}

module.exports = app;
