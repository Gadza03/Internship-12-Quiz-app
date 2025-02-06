import { startQuizGame } from "./quiz.js";
import { displayQuizHistory } from "./history.js";

document.addEventListener("DOMContentLoaded", displayQuizHistory);

const form = document.querySelector("#quiz-form");
form.addEventListener("submit", function (event) {
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
  startQuizGame(url.toString());
});
