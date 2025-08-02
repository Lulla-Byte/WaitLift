function createWorkout(category) {
  fetch('http://localhost:3000/workout/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ category }) // send selected category to backend
  })
    .then(res => res.json())
    .then(data => {
      console.log('Workout created:', data);
      localStorage.setItem('hasWorkout', 'true');
      loadViewWorkoutView(); // load the view workout screen next
    })
    .catch(err => {
      console.error('Error creating workout:', err);
    });
}

function loadCreateWorkoutView() {
  console.log('Create Workout view loaded');
  const app = document.getElementById('app');
  app.innerHTML = `
    <h2>Select Your Workout Type</h2>
    <div id="category-buttons">
      <button data-category="Upper">Upper Body</button>
      <button data-category="Lower">Lower Body</button>
      <button data-category="Full">Full Body</button>
      <button data-category="Cardio">Cardio</button>
    </div>
    <button id="goBackBtn">← Back to Home</button>
  `;

  //click handlers to each category button
  const buttons = document.querySelectorAll('#category-buttons button');
  buttons.forEach(btn => {
    btn.onclick = () => {
      const category = btn.getAttribute('data-category');
      createWorkout(category);
    };
  });

  document.getElementById('goBackBtn').onclick = loadHomeView;
}
