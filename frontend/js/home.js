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

  document.getElementById('viewWorkoutBtn').onclick = fetchAndRenderMachines;
  document.getElementById('createWorkoutBtn').onclick = loadCreateWorkoutView;
}