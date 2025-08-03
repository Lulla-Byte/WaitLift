function loadViewWorkoutView() {
  const app = document.getElementById('app');

  const workoutQueue = JSON.parse(localStorage.getItem('workoutQueue') || '[]');
  const currentIndex = parseInt(localStorage.getItem('currentIndex') || '0');

  if (workoutQueue.length === 0) {
    app.innerHTML = `
      <h2>No workout started yet</h2>
      <button id="backBtn">← Back to Home</button>
    `;
    document.getElementById('backBtn').onclick = loadHomeView;
    return;
  }

  const currentMachine = workoutQueue[currentIndex];

  app.innerHTML = `
    <h2>My Workout</h2>
    <p><strong>Machine ${currentIndex + 1} of ${workoutQueue.length}:</strong> ${currentMachine}</p>

    <p id="timerDisplay">Timer: Not started</p>
    <button id="startTimerBtn">Start Timer</button>
    <button id="nextBtn" disabled>Next Machine</button>
    <button id="backBtn">← Back to Home</button>

    <ul>
      ${workoutQueue
        .map((name, index) => {
          const isCurrent = index === currentIndex ? ' (current)' : '';
          return `<li>${name}${isCurrent}</li>`;
        })
        .join('')}
    </ul>
  `;

  let timer = null;
  let timeLeft = 10; // 10 seconds for demo purposes

  document.getElementById('startTimerBtn').onclick = () => {
    const timerDisplay = document.getElementById('timerDisplay');
    document.getElementById('startTimerBtn').disabled = true;

    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time left: ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        timerDisplay.textContent = `Done!`;
        document.getElementById('nextBtn').disabled = false;
      }
    }, 1000);
  };

  document.getElementById('nextBtn').onclick = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < workoutQueue.length) {
      localStorage.setItem('currentIndex', nextIndex);
      loadViewWorkoutView();
    } else {
      alert('Workout complete!');
      localStorage.removeItem('workoutQueue');
      localStorage.removeItem('hasWorkout');
      localStorage.removeItem('currentIndex');
      loadHomeView();
    }
  };

  document.getElementById('backBtn').onclick = loadHomeView;
}
