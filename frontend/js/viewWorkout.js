function loadViewWorkoutView() {
  const app = document.getElementById('app');
  app.innerHTML = `<h2>Loading your workout...</h2>`;

  const workoutQueue = JSON.parse(localStorage.getItem('workoutQueue') || '[]');
  const userId = localStorage.getItem('userId') || Date.now().toString();
  localStorage.setItem('userId', userId);

  if (workoutQueue.length === 0) {
    app.innerHTML = `
      <h2>No workout started yet</h2>
      <button id="backBtn">← Back to Home</button>
    `;
    document.getElementById('backBtn').onclick = loadHomeView;
    return;
  }

  // Initial render
  fetchAndRenderMachines();

  // Auto-refresh every 5 seconds
  if (window._machineInterval) clearInterval(window._machineInterval);
  window._machineInterval = setInterval(fetchAndRenderMachines, 5000);
}

  // fetch live machine data from backend
  fetch('http://localhost:3000/machines')
    .then(res => res.json())
    .then(allMachines => {
      // show machines selected by the user
      const selectedMachines = allMachines.filter(m =>
        workoutQueue.includes(m.name)
      );

      app.innerHTML = `
        <h2>My Workout</h2>
        <ul>
          ${selectedMachines.map(machine => renderMachine(machine, userId)).join('')}
        </ul>
        <button id="backBtn">← Back to Home</button>
      `;

      document.getElementById('backBtn').onclick = loadHomeView;
    });

// Helper function to render each machine
function renderMachine(machine, userId) {
  let statusLabel = `Status: ${machine.status}`;
  let actionBtn = '';

  const isInQueue = machine.queue.includes(userId);
  const isNext = machine.queue[0] === userId;

  if (machine.status === 'Available') {
    actionBtn = `<button onclick="startTimer('${machine.name}')">Start Timer</button>`;
  } else if (isNext) {
    statusLabel += ` — You're Up!`;
  } else if (isInQueue) {
    statusLabel += ` — In Queue`;
  } else {
    actionBtn = `<button onclick="joinQueue('${machine.name}')">Join Queue</button>`;
  }

  return `
    <li>
      <strong>${machine.name}</strong><br/>
      ${statusLabel}<br/>
      ${actionBtn}
    </li>
  `;
}

// Fetch machines and render them in the workout view
function fetchAndRenderMachines() {
  const workoutQueue = JSON.parse(localStorage.getItem('workoutQueue') || '[]');
  const userId = localStorage.getItem('userId');

  fetch('http://localhost:3000/machines')
    .then(res => res.json())
    .then(allMachines => {
      const selectedMachines = allMachines.filter(m =>
        workoutQueue.includes(m.name)
      );

      const app = document.getElementById('app');
      app.innerHTML = `
        <h2>My Workout</h2>
        <ul>
          ${selectedMachines.map(machine => renderMachine(machine, userId)).join('')}
        </ul>
        <button id="backBtn">← Back to Home</button>
      `;

      document.getElementById('backBtn').onclick = loadHomeView;
    });
}


// function to start the timer for a machine
// need to add a countdown
function startTimer(machineName) {
  const userId = localStorage.getItem('userId');

  fetch('http://localhost:3000/machines/start-timer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ machineName, userId })
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to start timer');
      return res.json();
    })
    .then(() => {
      // Re-render view to reflect updated status
      loadViewWorkoutView();
    })
    .catch(err => {
      alert(`Error: ${err.message}`);
    });
}

// function to join the queue for a machine
// will update logic but button works for now
function joinQueue(machineName) {
  const userId = localStorage.getItem('userId');

  fetch('http://localhost:3000/machines/start-timer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ machineName, userId })
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to join queue');
      return res.json();
    })
    .then(() => {
      loadViewWorkoutView(); // refresh UI
    })
    .catch(err => {
      alert(`Error: ${err.message}`);
    });
}
