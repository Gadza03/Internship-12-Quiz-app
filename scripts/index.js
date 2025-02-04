import { getQuestions } from "./api.js";

let currentQuestion = 0;
let questions = [];
let score = 0;

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

  answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.classList.add("answerBtn");

    btn.dataset.correct =
      answer === questions[currentQuestion].correct_answer ? "true" : "false";

    btn.addEventListener("click", checkAnswer);
    answersWrapper.appendChild(btn);
  });
}

function checkAnswer(e) {
  const selectedBtn = e.target;
  selectedBtn.style.backgroundColor = "orange";
  const isCorrect = selectedBtn.dataset.correct === "true";

  setTimeout(() => {
    const confirmAnswer = confirm("Do you want to confirm your answer?");
    if (confirmAnswer) {
      if (isCorrect) {
        selectedBtn.style.backgroundColor = "green";
        score++;
      } else {
        selectedBtn.style.backgroundColor = "red";
      }

      nextQuestionBtn.style.display = "block";
    } else selectedBtn.style.backgroundColor = "";
  }, 2000);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function nextQuestion() {
  currentQuestion++;
  displayQuestion();
}
