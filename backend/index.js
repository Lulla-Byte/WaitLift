const express = require('express');
const app = express();
const port = 3000;

app.get('/equipment/status', (req, res) => {
  res.status(200).json({ treadmill: 'available', squatRack: 'in-use' });
});

if (require.main === module) {
  app.listen(port, () => console.log(`WaitLift backend running on port ${port}`));
}

module.exports = app;
