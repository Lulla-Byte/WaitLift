function loadHomeView() {
  const app = document.getElementById('app');
  const hasWorkout = localStorage.getItem('hasWorkout') === 'true';

  app.innerHTML = `
    <h1>WaitLift</h1>
    <button id="viewWorkoutBtn">View Workout</button>
    <button id="createWorkoutBtn">${hasWorkout ? 'Modify' : 'Create'} Workout</button>
  `;

  document.getElementById('viewWorkoutBtn').onclick = loadViewWorkoutView;
  document.getElementById('createWorkoutBtn').onclick = loadCreateWorkoutView;
}
