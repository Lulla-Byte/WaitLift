function loadHomeView() {
  const app = document.getElementById('app');
  const hasWorkout = localStorage.getItem('hasWorkout') === 'true';
  const workoutQueue = JSON.parse(localStorage.getItem('workoutQueue') || '[]');
  const hasValidWorkout = hasWorkout && workoutQueue.length > 0;

  // prevent auto-refresh if no workout is started
  if (window._machineInterval) {
    clearInterval(window._machineInterval);
    window._machineInterval = null;
  }

  app.innerHTML = `
    <h1>WaitLift</h1>
  </div>
    <div class="button-row">
      <button id="viewWorkoutBtn">View Workout</button>
      <button id="createWorkoutBtn">${hasValidWorkout ? 'Modify' : 'Create'} Workout</button>
    </div>
  `;

  fetch(`${API_URL}/machines`)
  .then(res => res.json())
  .then(allMachines => {
    const busyCount = allMachines.filter(m => m.status === "Busy").length;
    const longQueues = allMachines.filter(m => m.queue.length >= 3).length;

    let gymStatus = `<span class="status-badge chill">Gym is currently chill</span>`;
    if (busyCount >= 3 && longQueues >= 2) {
      gymStatus = `<span class="status-badge peak">Peak time — expect delays</span>`;
    } else if (busyCount >= 2 || longQueues >= 1) {
      gymStatus = `<span class="status-badge busy">Gym is getting busy</span>`;
    }

    const machinesAvailable = allMachines.filter(m => m.status === 'Available').length;
    const usersInQueue = allMachines
    .filter(m => m.status === 'Busy')
    .reduce((acc, m) => acc + m.queue.length, 0);

    const statsElement = document.createElement('div');
    statsElement.className = 'gym-stats';
    statsElement.innerHTML = `
  <div class="dashboard-insights">
      <!-- Top Row -->
      <div class="stat-card" style="grid-column: 1;">
        <span class="dot green"></span>
        Machines Available: <strong>${machinesAvailable}</strong>
      </div>
      <div class="stat-card" style="grid-column: 2;">
        <span class="icon purple">👥</span>
        Users in Queue: <strong>${usersInQueue}</strong>
      </div>
      <div class="stat-card placeholder-card" style="grid-column: 3;">
        <span class="icon purple">🦵</span>
        Up Next: <strong>Leg Press</strong>
      </div>

      <!-- Row 2 -->
      <div class="stat-card goal-card" style="grid-column: 1 / 2;">
        <span class="icon goal">🎯</span>
       Goal for Today: <strong>3 sets of legs</strong>
     </div>

      <div class="mini-card-wrap" style="grid-column: 2 / 4;">
       <div class="stat-card streak-card">
         <div class="streak-emoji">🔥</div>
          <div class="streak-text"><strong>3-Day</strong><br>Streak</div>
       </div>
        <div class="stat-card pr-highlight" style="grid-column: 2 / 3;">
        <span class="icon pr">🏋️‍♂️</span>
        New PR: <strong>Squat - 135 lbs</strong>
      </div>
   </div>
  </div>
`;

    app.appendChild(statsElement);

    const statusElement = document.createElement('p');
    statusElement.className = 'status';
    statusElement.innerHTML = `<strong>${gymStatus}</strong>`;
    app.prepend(statusElement);
  });

  document.getElementById('viewWorkoutBtn').onclick = fetchAndRenderMachines;
  document.getElementById('createWorkoutBtn').onclick = loadCreateWorkoutView;
}