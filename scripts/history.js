export function saveQuizResult(score) {
  const date = new Date().toLocaleString();

  const categorySelect = document.querySelector("#category");
  const difficultySelect = document.querySelector("#difficulty");

  const categoryName = categorySelect.selectedOptions[0].textContent;
  const difficultyName = difficultySelect.selectedOptions[0].textContent;

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
  displayQuizHistory();
}

export function displayQuizHistory() {
  const quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];

  const historyContainer = document.querySelector(".quiz-history");
  const existingTable = historyContainer.querySelector("table");
  if (existingTable) existingTable.remove();

  const newTable = document.createElement("table");
  newTable.classList.add("quiz-history-background");

  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
                  <th>Result</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Date</th>`;
  newTable.appendChild(headerRow);

  quizHistory.forEach((quiz) => {
    const row = document.createElement("tr");
    const atributes = Object.values(quiz);

    for (let i = 0; i < atributes.length; i++) {
      const rowData = document.createElement("td");
      if (i === 0) {
        rowData.textContent = `${atributes[0]}/${atributes[1]}`;
        i++;
      } else {
        rowData.textContent = `${atributes[i]}`;
      }
      row.appendChild(rowData);
    }
    newTable.appendChild(row);
  });
  historyContainer.appendChild(newTable);
}
