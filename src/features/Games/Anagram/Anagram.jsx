import { useEffect, useState } from "react";
import { ANAGRAM_MODES } from "../../../utils/gameConfig";
import { shuffleWord } from "../../../utils/anagramUtils";
import "./anagram.css";

export default function AnagramGame() {
  const [mode, setMode] = useState("MEDIUM");
  const [currentSet, setCurrentSet] = useState(null);
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  const [foundAnswers, setFoundAnswers] = useState([]);
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
 // const [autoTimer, setAutoTimer] = useState(null);

  const config = ANAGRAM_MODES[mode];

  const isComplete =
    currentSet &&
    foundAnswers.length === currentSet.answers.length;

  useEffect(() => {
    nextWord();
  }, [mode]);

  const nextWord = () => {
    const item =
      config.words[Math.floor(Math.random() * config.words.length)];

    setCurrentSet(item);
    setScrambled(shuffleWord(item.base));
    setFoundAnswers([]);
    setInput("");
    setResult("");
    setShowAnswers(false);

    if (autoTimer) clearTimeout(autoTimer);
  };

  const resetGame = () => {
    if (autoTimer) clearTimeout(autoTimer);

    setScore(0);
    setFoundAnswers([]);
    setInput("");
    setResult("");
    setShowAnswers(false);

    nextWord();
  };

  const checkAnswer = () => {
    if (!currentSet) return;

    const guess = input.toLowerCase().trim();

    if (
      currentSet.answers.includes(guess) &&
      !foundAnswers.includes(guess)
    ) {
      setFoundAnswers((prev) => [...prev, guess]);
      setScore((s) => s + 1);
      setResult("✅ Correct!");
    } else if (foundAnswers.includes(guess)) {
      setResult("⚠️ Already found!");
    } else {
      setResult("❌ Try again");
    }

    setInput("");
  };

  // ✅ Auto-next keep this code for future use
//   useEffect(() => {
//     if (isComplete) {
//       setShowAnswers(true);

//       const timer = setTimeout(() => {
//         nextWord();
//       }, 1500);

//       setAutoTimer(timer);

//       return () => clearTimeout(timer);
//     }
//   }, [isComplete]);

  // ✅ Manual next
  const handleNext = () => {
   // if (autoTimer) clearTimeout(autoTimer); //jira id to be added 
    nextWord();
  };

  // 👁 Peek answers
  const peekAnswers = () => {
    setShowAnswers(true);
    setTimeout(() => setShowAnswers(false), 3000);
  };

  return (
    <div className="anagram-wrapper">
      <h2>🔤 Anagram Challenge</h2>

      {/* Top Bar */}
      <div className="top-bar">
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          {Object.keys(ANAGRAM_MODES).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <button className="reset-btn" onClick={resetGame}>
          🔄 Reset
        </button>
      </div>

      {/* Scrambled */}
      <p className="scrambled">{scrambled}</p>

      {/* Input */}
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a word..."
          onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
        />
        <button onClick={checkAnswer}>Submit</button>
      </div>

      {/* Result */}
      <p className="result">{result}</p>

      {/* Controls */}
      <div className="btn-row">
        <button onClick={peekAnswers}>👁 Peek (3s)</button>
        <button onClick={() => setShowAnswers(true)}>
          📖 Show Answers
        </button>
      </div>

      {/* Answers */}
      <div className="answers">
        {currentSet &&
          currentSet.answers.map((ans, i) => {
            const isVisible =
              foundAnswers.includes(ans) || showAnswers;

            return (
              <span
                key={i}
                className={isVisible ? "found" : "hidden"}
              >
                {isVisible ? ans : "????"}
              </span>
            );
          })}
      </div>

      {/* Next Controls */}
      <div className="btn-row">
        <button className="next-btn" onClick={handleNext}>
          ⏭ Skip
        </button>

        <button
          className="next-btn"
          onClick={handleNext}
          disabled={!isComplete}
        >
          Next ▶
        </button>
      </div>

      {/* Score */}
      <p className="score">Score: {score}</p>
    </div>
  );
}