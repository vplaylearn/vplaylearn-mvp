import { useEffect, useState } from "react";
import "./memory.css";

const symbols = ["🍎", "🚀", "🐱", "🎮", "⚽", "🎧"];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showAll, setShowAll] = useState(true); // 👈 NEW

  useEffect(() => {
    
    const doubled = [...symbols, ...symbols].map((symbol, i) => ({
      id: i,
      symbol,
    }));

    setCards(shuffle(doubled));

    // 👇 show all cards for 5 seconds
    setShowAll(true);

    const timer = setTimeout(() => {
      setShowAll(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleFlip = (card) => {
    // ❌ block clicks during preview
    if (showAll) return;

    if (
      flipped.length === 2 ||
      flipped.includes(card.id) ||
      matched.includes(card.id)
    )
      return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);

      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first.symbol === second.symbol) {
        setMatched([...matched, firstId, secondId]);
      }

      setTimeout(() => setFlipped([]), 700);
    }
  };

  const resetGame = () => {
    const reset = [...symbols, ...symbols].map((symbol, i) => ({
      id: i,
      symbol,
    }));

    setCards(shuffle(reset));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setShowAll(true);

    setTimeout(() => setShowAll(false), 5000);
  };

  return (
    <div className="game-wrapper">
      <h2>🧠 Memory Flip Game</h2>
      <p>Moves: {moves}</p>

      {showAll && <p className="hint">👀 Memorize the cards! you have 5 seconds</p>}

      <div className="grid">
        {cards.map((card) => {
          const isFlipped =
            showAll || // 👈 show all initially
            flipped.includes(card.id) ||
            matched.includes(card.id);

          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleFlip(card)}
            >
              <div className="inner">
                <div className="front">❓</div>
                <div className="back">{card.symbol}</div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={resetGame} className="reset">
        Restart Game
      </button>
    </div>
  );
}