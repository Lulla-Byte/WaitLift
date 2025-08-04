function createWorkout(category) {
  fetch(`${API_URL}/machines`)
    .then(res => res.json())
    .then(data => {
      // Filter machines by category and prepare the selection form
      const machines = data
        .filter(machine => machine.categories.includes(category))
        .map(machine => machine.name);
      const selectedQueue = JSON.parse(localStorage.getItem('workoutQueue')) || [];
      const app = document.getElementById('app');

      app.innerHTML = `
  <div class="equipment-container">
    <h2>Select Equipment for ${category}</h2>
    <form id="machineSelectionForm" class="equipment-list">
      ${machines
          .map(name => {
            const checked = selectedQueue.includes(name) ? 'checked' : '';
            return `
            <label class="equipment-item">
              <input type="checkbox" name="equipment" value="${name}" ${checked}>
              ${name}
            </label>
          `;
          })
          .join('')}
    </form>
    <div class="button-row">
      <button id="saveBtn">💾 Save Selection</button>
      <button id="startWorkoutBtn">▶️ Start Workout</button>
    </div>
    <button class="back-btn" id="goBackBtn">← Back to Home</button>
  </div>
`;


      // TODO: need to replace localStorage with POST to backend later
      // will update the UI later
      document.getElementById('saveBtn').onclick = () => {
        const selected = Array.from(
          document.querySelectorAll('input[name="equipment"]:checked')
        ).map(checkbox => checkbox.value);

        const existingQueue = JSON.parse(localStorage.getItem('workoutQueue')) || [];
        const filtered = existingQueue.filter(name => !machines.includes(name));
        const updatedQueue = [...filtered, ...selected];

        if (updatedQueue.length === 0) {
          alert("Your workout can't be empty. Please select at least one machine.");
          return;
        }

        localStorage.setItem('hasWorkout', 'true');
        localStorage.setItem('workoutQueue', JSON.stringify(updatedQueue));

        alert("Saved! You can now select another category or start your workout.");
        loadCreateWorkoutView(); // stay on category screen
      };

      document.getElementById('startWorkoutBtn').onclick = () => {
        const selected = Array.from(
          document.querySelectorAll('input[name="equipment"]:checked')
        ).map(checkbox => checkbox.value);

        const existingQueue = JSON.parse(localStorage.getItem('workoutQueue')) || [];
        const filtered = existingQueue.filter(name => !machines.includes(name));
        const updatedQueue = [...filtered, ...selected];

        if (updatedQueue.length === 0) {
          alert("Your workout can't be empty. Please select at least one machine.");
          return;
        }

        localStorage.setItem('hasWorkout', 'true');
        localStorage.setItem('workoutQueue', JSON.stringify(updatedQueue));
        loadViewWorkoutView(); // now go to workout view
      };

      document.getElementById('goBackBtn').onclick = loadHomeView;
    });
}

function loadCreateWorkoutView() {
  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="create-container">
    <h2>Select Your Workout Type</h2>
    <div class="category-grid">
      <button class="category-btn" data-category="Upper">💪 Upper Body</button>
      <button class="category-btn" data-category="Lower">🦵 Lower Body</button>
      <button class="category-btn" data-category="Full">🏋️ Full Body</button>
      <button class="category-btn" data-category="Cardio">🏃 Cardio</button>
    </div>
    <button class="back-btn" id="goBackBtn">← Back to Home</button>
  </div>
`;


  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
    btn.onclick = () => {
      const category = btn.getAttribute('data-category');
      createWorkout(category);
    };
  });

  document.getElementById('goBackBtn').onclick = loadHomeView;
}

function handleSaveOrStart(shouldStartWorkout) {
  const selected = Array.from(
    document.querySelectorAll('input[name="equipment"]:checked')
  ).map(checkbox => checkbox.value);

  const existingQueue = JSON.parse(localStorage.getItem('workoutQueue')) || [];
  const filtered = existingQueue.filter(name => !machines.includes(name));
  const updatedQueue = [...filtered, ...selected];

  if (updatedQueue.length === 0) {
    alert("Your workout can't be empty. Please select at least one machine.");
    return;
  }

  localStorage.setItem('hasWorkout', 'true');
  localStorage.setItem('workoutQueue', JSON.stringify(updatedQueue));

  if (shouldStartWorkout) {
    loadViewWorkoutView();
  } else {
    alert("Saved! You can select another category.");
    loadCreateWorkoutView();
  }
}
