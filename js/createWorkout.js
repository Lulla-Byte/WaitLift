let API_URL = '';
fetch('./config.json')
  .then(res => res.json())
  .then(config => {
    API_URL = window.location.hostname === 'localhost'
      ? config.LOCALHOST
      : config.PROD;
  });

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
      <button id="saveBtn">Save Selection</button>
      <button id="startWorkoutBtn">Start Workout</button>
      <button id="goBackBtn">← Back to Home</button>
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
