import { getQuestions } from "./api.js";

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
    const questions = await getQuestions(url.toString());
    displayQuestion(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
});

function displayQuestion(questions) {
  const question = questions[0].question;
  const answers = [
    ...questions[0].incorrect_answers,
    questions[0].correct_answer,
  ];

  answers = shuffleArray(answers);

  console.log(question);

  const questionElement = document.querySelector(".question");
  questionElement.innerHTML = question;

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
  }
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
