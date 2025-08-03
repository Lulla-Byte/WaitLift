function createWorkout(category) {
  fetch('http://localhost:3000/machines')
    .then(res => res.json())
    .then(data => {
      // Filter machines by category and prepare the selection form
      const machines = data
        .filter(machine => machine.categories.includes(category))
        .map(machine => machine.name);
      const selectedQueue = JSON.parse(localStorage.getItem('workoutQueue')) || [];
      const app = document.getElementById('app');

      app.innerHTML = `
        <h2>Select Equipment for ${category}</h2>
        <form id="machineSelectionForm">
          ${machines
            .map(name => {
              const checked = selectedQueue.includes(name) ? 'checked' : '';
              return `
                <div>
                  <input type="checkbox" id="${name}" name="equipment" value="${name}" ${checked}>
                  <label for="${name}">${name}</label>
                </div>
              `;
            })
            .join('')}
        </form>
        <button id="startWorkoutBtn">Start Workout</button>
        <button id="goBackBtn">← Back to Home</button>
      `;

      // TODO: need to replace localStorage with POST to backend later
      // will update the UI later
      document.getElementById('startWorkoutBtn').onclick = () => {
        const selected = Array.from(
          document.querySelectorAll('input[name="equipment"]:checked')
        ).map(checkbox => checkbox.value);

        if (selected.length === 0) {
          alert("Please select at least one machine to continue");
          return;
        }

        localStorage.setItem('hasWorkout', 'true');
        localStorage.setItem('workoutQueue', JSON.stringify(selected));
        loadViewWorkoutView();
      };

      document.getElementById('goBackBtn').onclick = loadHomeView;
    });
}

function loadCreateWorkoutView() {
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

  const buttons = document.querySelectorAll('#category-buttons button');
  buttons.forEach(btn => {
    btn.onclick = () => {
      const category = btn.getAttribute('data-category');
      createWorkout(category);
    };
  });

  document.getElementById('goBackBtn').onclick = loadHomeView;
}