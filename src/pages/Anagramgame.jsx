import { useState } from "react";

const PUZZLES = [
  {
    letters: "listen",
    answers: ["listen", "silent", "enlist"],
    hint: "Related to hearing"
  },
  {
    letters: "evil",
    answers: ["evil", "vile", "live"],
    hint: "Opposite of good"
  },
  {
    letters: "stone",
    answers: ["stone", "tones", "notes"],
    hint: "Rock / music / writing"
  },
  {
    letters: "react",
    answers: ["react", "caret", "crate"],
    hint: "Frontend library"
  }
];

export default function AnagramGame() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [found, setFound] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const puzzle = PUZZLES[index];

  const submit = () => {
    const answer = input.toLowerCase().trim();

    if (!answer) return;

    if (found.includes(answer)) {
      setMessage("⚠️ Already found!");
      return;
    }

    if (puzzle.answers.includes(answer)) {
      setFound([...found, answer]);
      setScore(score + 1);
      setMessage("🎉 Correct!");
    } else {
      setMessage("❌ Wrong!");
    }

    setInput("");
  };

  const nextPuzzle = () => {
    setIndex((prev) => (prev + 1) % PUZZLES.length);
    setFound([]);
    setInput("");
    setMessage("");
  };

  const showHint = () => {
    setMessage("💡 Hint: " + puzzle.hint);
  };

  return (
    <div style={styles.container}>
      <h1>🧩 Anagram Challenge</h1>

      <h2 style={styles.letters}>
        {puzzle.letters.toUpperCase()}
      </h2>

      <p>Find all possible words!</p>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter word"
        style={styles.input}
      />

      <div>
        <button onClick={submit} style={styles.button}>
          Submit
        </button>

        <button onClick={showHint} style={styles.button}>
          Hint
        </button>

        <button onClick={nextPuzzle} style={styles.button}>
          Next
        </button>
      </div>

      <p>{message}</p>

      <h3>Found Words</h3>
      <ul>
        {found.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>

      <h3>Score: {score}</h3>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial",
    padding: "20px"
  },
  letters: {
    fontSize: "34px",
    letterSpacing: "10px",
    margin: "20px"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    margin: "10px"
  },
  button: {
    margin: "5px",
    padding: "10px 15px",
    cursor: "pointer"
  }
};