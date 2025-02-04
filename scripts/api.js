async function getQuestions(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.results);
    return data.results;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}

export { getQuestions };
