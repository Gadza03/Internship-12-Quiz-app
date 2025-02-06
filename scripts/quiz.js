import { getQuestions } from "./api.js";
import { shuffleArray, decodeHTML } from "./utils.js";
import { startTimer, stopTimer } from "./timer.js";
import { saveQuizResult } from "./history.js";

let questions = [];
let currentQuestion = 0;
let score = 0;
let lastSelectedBtn = null;
let currentTimeout;

const currentScore = document.querySelector(".score");
const formWrapper = document.querySelector(".form-container");

const nextQuestionBtn = document.querySelector("#next-question");
nextQuestionBtn.addEventListener("click", nextQuestion);

const questionContainer = document.querySelector(".questions-container");
const startQuiz = document.querySelector(".start-quiz");
const finalResults = document.querySelector(".final-results");
const submitButton = document.querySelector("#submit");

export async function startQuizGame(url) {
  submitButton.disabled = true;

  questions = await getQuestions(url);
  console.log(questions);
  if (questions.length === 0) {
    alert("No questions found for your filters. Please, try again.");
    submitButton.disabled = false;
    return;
  }
  displayStartButton();
  submitButton.disabled = false;
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
    stopTimer();
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
      startTimer();
    }
  }, 2000);
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

  saveQuizResult(score);
}

export function timeIsUp() {
  if (currentQuestion === questions.length - 1) {
    alert("Unfortunately you ran out of time.\nThis was last question.");
    finishQuiz();
  } else {
    alert(
      "Unfortunately you ran out of time.\nLet's move to the next question."
    );
    nextQuestion();
  }
}

const scoreMessages = [
  "Don't worry, you'll do better next time! Keep practicing!",
  "Not great, but every attempt is a step forward. Try again!",
  "You're getting there! A little more effort and you'll improve!",
  "Good job! You're above average, but there's room for improvement!",
  "Almost perfect! Just one more step to excellence!",
  "Amazing! You nailed it! You're a quiz master!",
];
