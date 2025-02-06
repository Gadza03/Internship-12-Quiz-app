import { timeIsUp } from "./quiz.js";

export let timer;
let interval;
const timerDisplay = document.querySelector(".timer");

export function startTimer(duration) {
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

export function timerHandler() {
  if (timer <= 0) timeIsUp();
  else startTimer(timer);
}

function updateDisplay() {
  timerDisplay.textContent = `Time left: ${timer}s`;
}
