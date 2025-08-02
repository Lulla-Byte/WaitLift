const express = require('express');
const router = express.Router();
router.use(express.json()); // for parsing JSON bodies

let queue = [];

// join the queue
router.post('/join', (req, res) => {
  const user = Date.now().toString(); // simple ID for now
  queue.push(user);
  res.status(200).json({ message: 'You have joined the queue', user, position: queue.length });
});

// view the queue
router.get('/view', (req, res) => {
  res.status(200).json({ queue });
});

// leave the queue
router.post('/leave', (req, res) => {
  const { user } = req.body;
  queue = queue.filter(id => id !== user);
  res.json({ message: 'You have left the queue.', queue });
});

module.exports = router;
