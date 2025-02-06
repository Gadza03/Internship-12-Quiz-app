export function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export function decodeHTML(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent;
}
