function loadViewWorkoutView() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h2>My Workout</h2>
    <p>(Workout queue will be shown here)</p>
    <button id="backToHomeBtn">← Back to Home</button>
  `;

  document.querySelector('#backToHomeBtn').onclick = loadHomeView;
}
