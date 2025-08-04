const API_URL = window.location.hostname.includes('github.io')
  ? 'https://waitlift-service.onrender.com'
  : 'http://localhost:3000';

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

function renderMachine(machine, userId) {
  const isInQueue = machine.queue.includes(userId);
  const position = machine.queue.indexOf(userId);
  const isNext = machine.queue[0] === userId;
  const cardClass = isNext ? 'machine-card youre-up' : 'machine-card';

  let statusText = machine.status;
  let statusClass = machine.status === 'Available' ? 'available' : 'busy';
  let actionBtn = '';

  if (isNext) {
    statusText += " — You're Up!";
    actionBtn = `<button class="queue-btn" onclick="finishMachine('${machine.name}')">Finish</button>`;
  } else if (isInQueue) {
    statusText += ` — In Queue (Position ${position + 1})`;
    actionBtn = `<button class="queue-btn" onclick="leaveQueue('${machine.name}')">Leave Queue</button>`;
  } else {
    actionBtn = `<button class="queue-btn" onclick="joinQueue('${machine.name}')">Join Queue</button>`;
  }

  return `
    <div class="${cardClass}">
        <div class="machine-name">
      ${machine.name}
      ${isNext ? `<span class="badge youre-up">You're Up!</span>` : ''}
    </div>
    <div class="machine-status-line">
      <span class="machine-status-label">Status:</span>
      <span class="machine-status ${statusClass}">
         ${machine.status}${isInQueue && !isNext ? ` — In Queue (Position ${position + 1})` : ''}
      </span>
    </div>
    ${actionBtn}
  </div>
`;
}


// Fetch machines and render them in the workout view
function fetchAndRenderMachines() {
  const workoutQueue = JSON.parse(localStorage.getItem('workoutQueue') || '[]');
  const userId = localStorage.getItem('userId');
  const app = document.getElementById('app');
  if (!app) return;

  fetch(`${API_URL}/machines`)
    .then(res => res.json())
    .then(allMachines => {
      const selectedMachines = allMachines.filter(m =>
        workoutQueue.includes(m.name)
      );

      app.innerHTML = `
        <div class="my-workout-container">
          <h2>My Workout</h2>
          <div class="machine-list">
            ${selectedMachines.map(machine => renderMachine(machine, userId)).join('')}
          </div>
          <button class="back-btn" id="backBtn">← Back to Home</button>
        </div>
      `;
      document.getElementById('backBtn').onclick = loadHomeView;
    });

  if (window._machineInterval) {
    clearInterval(window._machineInterval);
  }
  window._machineInterval = setInterval(fetchAndRenderMachines, 3000);
}


// replaced start timer function with finish button
function finishMachine(machineName) {
  const userId = localStorage.getItem('userId');

  fetch(`${API_URL}/machines/finish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ machineName, userId })
  })
    .then(res => res.json())
    .then(() => {
      fetchAndRenderMachines();
    })
    .catch(err => {
      alert("Failed to finish machine: " + err.message);
    });
}


// function to join the queue for a machine
function joinQueue(machineName) {
  const userId = localStorage.getItem('userId');

  fetch(`${API_URL}/machines/join-queue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ machineName, userId })
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to join queue');
      return res.json();
    })
    .then(() => {
      fetchAndRenderMachines(); // Refresh after joining
    })
    .catch(err => {
      alert("Error joining queue: " + err.message);
    });
}

// function to leave the queue for a machine
function leaveQueue(machineName) {
  const userId = localStorage.getItem('userId');

  fetch(`${API_URL}/machines`)
    .then(res => res.json())
    .then(allMachines => {
      const machine = allMachines.find(m => m.name === machineName);
      if (!machine) return;

      const index = machine.queue.indexOf(userId);
      if (index !== -1) {
        machine.queue.splice(index, 1); // Remove from queue

        // Update status if the user was first in line
        if (index === 0) {
          if (machine.queue.length === 0) {
            machine.status = 'Available';
          }
        }

        // Send PUT request to leave queue
        return fetch(`${API_URL}/machines/${encodeURIComponent(machineName)}/leave-queue`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
      }
    })
    .then(() => fetchAndRenderMachines())
    .catch(err => console.error('Failed to leave queue:', err));
}

