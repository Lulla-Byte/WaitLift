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
    <button id="viewWorkoutBtn">View Workout</button>
    <button id="createWorkoutBtn">${hasValidWorkout ? 'Modify' : 'Create'} Workout</button>
  `;

  fetch('http://localhost:3000/machines')
  .then(res => res.json())
  .then(allMachines => {
    const busyCount = allMachines.filter(m => m.status === "Busy").length;
    const longQueues = allMachines.filter(m => m.queue.length >= 3).length;

    let gymStatus = "🟢 Gym is currently chill";
    if (busyCount >= 3 || longQueues >= 2) {
      gymStatus = "🟡 Gym is getting busy";
    }
    if (busyCount >= 4 && longQueues >= 3) {
      gymStatus = "🔴 Peak time — expect delays";
    }

    const statusElement = document.createElement('p');
    statusElement.innerHTML = `<strong>${gymStatus}</strong>`;
    app.prepend(statusElement);
  });

  document.getElementById('viewWorkoutBtn').onclick = fetchAndRenderMachines;
  document.getElementById('createWorkoutBtn').onclick = loadCreateWorkoutView;
}