export function shuffleWordOld(word) {
  return word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export function shuffleWord(word) {
  let shuffled = word;

  // ensure it's actually shuffled differently
  while (shuffled === word) {
    shuffled = word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  return shuffled;
}