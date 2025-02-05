import { getQuestions } from "./api.js";

let currentQuestion = 0;
let questions = [];

let score = 0;
let timer;

let interval;
let currentTimeout;

let lastSelectedBtn = null;

const currentScore = document.querySelector(".score");

const timerDisplay = document.querySelector(".timer");

const formWrapper = document.querySelector(".form-container");

const nextQuestionBtn = document.querySelector("#next-question");
nextQuestionBtn.addEventListener("click", nextQuestion);

const questionContainer = document.querySelector(".questions-container");

const startQuiz = document.querySelector(".start-quiz");

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
  fetchAndValidateQuestions(url);
  submitButton.disabled = false;
});

async function fetchAndValidateQuestions(url) {
  try {
    questions = await getQuestions(url.toString());
    if (questions.length === 0) {
      throw new Error("No questions founded for your filters");
    }
    displayStartButton();
  } catch (error) {
    alert(`${error}. Please try again.`);
  }
}

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

  currentScore.textContent = `Score: ${score}`;

  answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.innerHTML = answer;
    btn.classList.add("answerBtn");

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

  let correct_answer = decodeHTML(questions[currentQuestion].correct_answer);

  const isCorrect = selectedBtn.textContent === correct_answer;

  currentTimeout = setTimeout(() => {
    const confirmAnswer = confirm("Do you want to confirm your answer?");
    clearInterval(interval);
    if (confirmAnswer) {
      if (isCorrect) {
        selectedBtn.style.backgroundColor = "green";
        score++;
        currentScore.textContent = `Score: ${score}`;
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

function decodeHTML(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent;
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

  saveQuizResult();
}

function saveQuizResult() {
  const date = new Date().toLocaleString();

  const categorySelect = document.querySelector("#category");
  const difficultySelect = document.querySelector("#difficulty");

  const categoryValue = categorySelect.value;
  const categoryName = categorySelect.selectedOptions[0].textContent;

  const difficultyValue = difficultySelect.value;
  const difficultyName = difficultySelect.selectedOptions[0].textContent;

  console.log(categoryValue, categoryName); // "27", "Animals"
  console.log(difficultyValue, difficultyName); // "easy", "Easy"

  console.log(category);

  const newResult = {
    score: score,
    total: 5,
    category: categoryName,
    difficulty: difficultyName,
    date: date,
  };

  const quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
  quizHistory.push(newResult);
  localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
}

function startTimer(duration) {
  clearInterval(interval);
  timer = duration;
  displayTimeLeft();

  interval = setInterval(() => {
    timer--;
    displayTimeLeft();
    if (timer <= 0) {
      clearInterval(interval);
      timeIsUp();
    }
  }, 1000);
}

function displayTimeLeft() {
  timerDisplay.textContent = `Time left: ${timer}s`;
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
