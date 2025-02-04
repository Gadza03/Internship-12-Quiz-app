import { getQuestions } from "./api.js";

let currentQuestion = 0;
let questions = [];
let score = 0;
let timer;
let interval;
let currentTimeout;
let lastSelectedBtn = null;

const nextQuestionBtn = document.querySelector("#next-question");
nextQuestionBtn.addEventListener("click", nextQuestion);

const form = document.querySelector("#quiz-form");
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const category = document.querySelector("#category").value;
  const difficulty = document.querySelector("#difficulty").value;
  const type = document.querySelector("#type").value;

  const url = new URL("https://opentdb.com/api.php");
  url.searchParams.append("amount", "5");

  if (category) url.searchParams.append("category", category);
  if (difficulty) url.searchParams.append("difficulty", difficulty);
  if (type) url.searchParams.append("type", type);

  console.log(url.toString());
  try {
    questions = await getQuestions(url.toString());
    displayQuestion(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
});

function displayQuestion() {
  const question = questions[currentQuestion].question;
  let answers = [
    ...questions[currentQuestion].incorrect_answers,
    questions[currentQuestion].correct_answer,
  ];

  answers = shuffleArray(answers);

  console.log(question);

  nextQuestionBtn.style.display = "none";

  const questionElement = document.querySelector(".question");
  questionElement.innerHTML = question;

  const answersWrapper = document.querySelector(".answers");
  answersWrapper.innerHTML = "";

  startTimer(20);

  document.querySelector(".score").textContent = `Score: ${score}`;

  answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.innerHTML = answer;
    btn.classList.add("answerBtn");

    btn.dataset.correct =
      answer === questions[currentQuestion].correct_answer ? "true" : "false";

    btn.addEventListener("click", checkAnswer);
    answersWrapper.appendChild(btn);
  });
}

function checkAnswer(e) {
  const selectedBtn = e.target;

  if (lastSelectedBtn && lastSelectedBtn !== selectedBtn) {
    clearTimeout(currentTimeout);
    lastSelectedBtn.style.backgroundColor = "";
    lastSelectedBtn.disabled = false;
  }

  lastSelectedBtn = selectedBtn;

  selectedBtn.disabled = true;

  selectedBtn.style.backgroundColor = "orange";
  const isCorrect = selectedBtn.dataset.correct === "true";

  currentTimeout = setTimeout(() => {
    const confirmAnswer = confirm("Do you want to confirm your answer?");
    clearInterval(interval);
    if (confirmAnswer) {
      if (isCorrect) {
        selectedBtn.style.backgroundColor = "green";
        score++;
      } else {
        selectedBtn.style.backgroundColor = "red";
      }

      document.querySelectorAll(".answerBtn").forEach((btn) => {
        btn.removeEventListener("click", checkAnswer);
      });

      nextQuestionBtn.style.display = "block";
    } else {
      selectedBtn.style.backgroundColor = "";
      selectedBtn.disabled = false;
      startTimer(timer);
    }
  }, 2000);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function nextQuestion() {
  currentQuestion++;
  displayQuestion();
}

function startTimer(duration) {
  clearInterval(interval);

  timer = duration;
  const timerDisplay = document.querySelector(".timer");

  timerDisplay.textContent = `Time left: ${timer}s`;

  interval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `Time left: ${timer}s`;

    if (timer <= 0) {
      clearInterval(interval);
      timeIsUp();
    }
  }, 1000);
}

function timeIsUp() {
  alert("Unfortunately you ran out of time.\nLet's move to the next question.");
  nextQuestion();
}
