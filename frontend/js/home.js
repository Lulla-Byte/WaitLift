function loadHomeView() {
  const app = document.getElementById('app');
  const hasWorkout = localStorage.getItem('hasWorkout') === 'true';
  const workoutQueue = JSON.parse(localStorage.getItem('workoutQueue') || '[]');
  const hasValidWorkout = hasWorkout && workoutQueue.length > 0;

  app.innerHTML = `
    <h1>WaitLift</h1>
    <button id="viewWorkoutBtn">View Workout</button>
    <button id="createWorkoutBtn">${hasValidWorkout ? 'Modify' : 'Create'} Workout</button>
  `;

  document.getElementById('viewWorkoutBtn').onclick = loadViewWorkoutView;
  document.getElementById('createWorkoutBtn').onclick = loadCreateWorkoutView;
}