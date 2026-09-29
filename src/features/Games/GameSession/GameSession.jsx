import { useEffect, useRef, useState } from "react";
import "./gameSession.css";

// Wraps any game with a countdown so a play session naturally ends in a set
// time, then hands control back to the proverb gate. The wrapped games are left
// untouched — this only adds a timer bar and an end screen around them.
export default function GameSession({ title, minutes = 7, onFinish, children }) {
  const [remaining, setRemaining] = useState(minutes * 60);
  const [ended, setEnded] = useState(false);
  // Keep the latest onFinish without resubscribing the interval each tick.
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (ended) return undefined;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setEnded(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [ended]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const low = remaining <= 30;

  if (ended) {
    return (
      <div className="session-end">
        <h2>⏰ Time's up!</h2>
        <p>Nice session on {title}. Read the next proverb to unlock another game.</p>
        <button type="button" className="session-btn" onClick={() => onFinishRef.current?.()}>
          Back to proverb →
        </button>
      </div>
    );
  }

  return (
    <div className="session-wrap">
      <div className="session-bar">
        <span className="session-title">{title}</span>
        <span className={`session-clock ${low ? "session-clock-low" : ""}`}>
          {mm}:{ss}
        </span>
        <button
          type="button"
          className="session-quit"
          onClick={() => setEnded(true)}
        >
          End session
        </button>
      </div>
      <div className="session-body">{children}</div>
    </div>
  );
}
