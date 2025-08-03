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

// POST /machines/start-timer
// { machineName: string, userId: string }
router.post('/start-timer', (req, res) => {
  const { machineName, userId } = req.body;

  const machine = machines.find(m => m.name === machineName);
  if (!machine) {
    return res.status(404).json({ error: 'Machine not found' });
  }

  if (machine.status === 'Busy') {
    return res.status(400).json({ error: 'Machine already in use' });
  }

  machine.status = 'Busy';

  if (!machine.queue.includes(userId)) {
    machine.queue.push(userId);
  }

  res.status(200).json({ message: 'Timer started', machine });
});

// POST /machines/end-timer
// { machineName: string }
router.post('/end-timer', (req, res) => {
  const { machineName } = req.body;

  const machine = machines.find(m => m.name === machineName);
  if (!machine) {
    return res.status(404).json({ error: 'Machine not found' });
  }

  machine.status = 'Available';

  //remove the first user in line (the one who just used it)
  machine.queue.shift();

  res.status(200).json({
    message: 'Machine is now available',
    machine
  });
});

module.exports = router;
