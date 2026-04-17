import { useState } from "react";

const WORDS = [
  "finance",
  "leap",
  "seed",
  "table",
  "chair",
  "cricket",
  "pillow",
  "hook"
];

// shuffle function
const shuffleWord = (word) => {
  return word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export default function Scramble() {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  const startGame = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    setScrambled(shuffleWord(word));
    setInput("");
    setMessage("");
  };

  const checkAnswer = () => {
    if (input.toLowerCase() === currentWord) {
      setMessage("🎉 Correct!");
      setScore(score + 1);
    } else {
      setMessage(`❌ Wrong! Answer was "${currentWord}"`);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Jumble Word Game</h1>

      {scrambled ? (
        <>
          <h2>Scrambled Word:</h2>
          <div style={styles.word}>{scrambled}</div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Guess the word"
            style={styles.input}
          />

          <div>
            <button onClick={checkAnswer} style={styles.button}>
              Check
            </button>

            <button onClick={startGame} style={styles.button}>
              Next Word
            </button>
          </div>

          <p>{message}</p>
          <h3>Score: {score}</h3>
        </>
      ) : (
        <button onClick={startGame} style={styles.button}>
          Start Game
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial",
    padding: "20px"
  },
  word: {
    fontSize: "30px",
    letterSpacing: "5px",
    margin: "15px"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    margin: "10px"
  },
  button: {
    padding: "10px 15px",
    margin: "5px",
    cursor: "pointer"
  }
};