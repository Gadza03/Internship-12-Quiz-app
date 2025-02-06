import { timeIsUp } from "./quiz.js";

let timer;
let interval;
const timerDisplay = document.querySelector(".timer");

export function startTimer(duration = timer) {
  stopTimer();
  timer = duration;
  updateDisplay();

  interval = setInterval(() => {
    timer--;
    updateDisplay();
    if (timer <= 0) {
      stopTimer();
      timeIsUp();
    }
  }, 1000);
}

export function stopTimer() {
  clearInterval(interval);
}

function updateDisplay() {
  timerDisplay.textContent = `Time left: ${timer}s`;
}
