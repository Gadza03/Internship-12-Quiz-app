import { getQuestions } from "./api.js";

let currentQuestion = 0;
let questions = [];
let score = 0;
let timer;
let interval;
let currentTimeout;
let lastSelectedBtn = null;

const formWrapper = document.querySelector(".form-container");

const nextQuestionBtn = document.querySelector("#next-question");
nextQuestionBtn.addEventListener("click", nextQuestion);

const questionContainer = document.querySelector(".questions-container");
questionContainer.classList.add("hidden");

const startQuiz = document.querySelector(".start-quiz");
startQuiz.classList.add("hidden");

const finalResults = document.querySelector(".final-results");

const submitButton = document.querySelector("#submit");

const form = document.querySelector("#quiz-form");
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  submitButton.disabled = true;
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
    displayStartButton();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
  submitButton.disabled = false;
});

function displayStartButton() {
  formWrapper.classList.add("hidden");
  startQuiz.classList.remove("hidden");

  const startQuizBtn = document.querySelector("#startBtn");
  startQuizBtn.addEventListener("click", () => displayQuestion());
}

function displayQuestion() {
  startQuiz.classList.add("hidden");
  questionContainer.classList.remove("hidden");

  const question = questions[currentQuestion].question;
  let answers = [
    ...questions[currentQuestion].incorrect_answers,
    questions[currentQuestion].correct_answer,
  ];

  answers = shuffleArray(answers);

  console.log(question);

  nextQuestionBtn.classList.add("hidden");

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

      nextQuestionBtn.classList.remove("hidden");
      changeBtnOnLastQuestion();
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

function changeBtnOnLastQuestion() {
  if (currentQuestion === questions.length - 1) {
    nextQuestionBtn.textContent = "Finish Quiz";

    nextQuestionBtn.removeEventListener("click", nextQuestion);
    nextQuestionBtn.addEventListener("click", finishQuiz);
  }
}

function finishQuiz() {
  const totalScore = document.querySelector("#total-score");
  const message = document.querySelector("#message");

  totalScore.textContent = score;
  message.textContent = scoreMessages[score];

  questionContainer.classList.add("hidden");
  finalResults.classList.remove("hidden");

  const tryAgainBtn = document.querySelector("#try-again");
  tryAgainBtn.addEventListener("click", () => location.reload());
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

const scoreMessages = [
  "Don't worry, you'll do better next time! Keep practicing!",
  "Not great, but every attempt is a step forward. Try again!",
  "You're getting there! A little more effort and you'll improve!",
  "Good job! You're above average, but there's room for improvement!",
  "Almost perfect! Just one more step to excellence!",
  "Amazing! You nailed it! You're a quiz master!",
];
