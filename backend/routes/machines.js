const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Load data from equipment.json
const filePath = path.join(__dirname, '../data/equipment.json');
let machines = [];

try {
  const data = fs.readFileSync(filePath, 'utf8');
  machines = JSON.parse(data).map(machine => ({
    ...machine,
    status: 'Available',  // all machines start as available
    queue: []             // start with empty queue
  }));
} catch (err) {
  console.error('Error loading equipment data:', err);
}

// GET /machines - return all machines with status and queue
router.get('/', (req, res) => {
  res.status(200).json(machines);
});

router.post('/finish', (req, res) => {
  const { machineName, userId } = req.body;
  const machine = machines.find(m => m.name === machineName);

  if (!machine) {
    return res.status(404).json({ error: 'Machine not found' });
  }

  // Remove the user from the queue
  machine.queue = machine.queue.filter(id => id !== userId);

  // Set new status
  if (machine.queue.length > 0) {
    machine.status = 'Busy';
  } else {
    machine.status = 'Available';
  }

  res.json({ message: 'Machine finished', machine });
});

router.post('/join-queue', (req, res) => {
  const { machineName, userId } = req.body;
  const machine = machines.find(m => m.name === machineName);

  if (!machine) {
    return res.status(404).json({ error: 'Machine not found' });
  }

  if (!machine.queue.includes(userId)) {
    machine.queue.push(userId);
    machine.status = 'Busy';
  }

  res.status(200).json({ message: 'Joined queue', queue: machine.queue });
});


module.exports = router;
