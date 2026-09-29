import { useState } from "react";
import Scramble from "../features/Games/Scramble/Scramble";
import GamesHub from "../features/Games/GamesHub/GamesHub";
import MemoryGame from "../features/Games/memory/Memory";
import AnagramGame from "../features/Games/Anagram/Anagram";
import ProverbGate from "../features/Games/ProverbGate/ProverbGate";
import GameSession from "../features/Games/GameSession/GameSession";
import {
  getProverbIndex,
  nextLockedGame,
  unlockNext,
  allUnlocked,
  resetProgress,
} from "../utils/gameProgress";

const GAME_META = {
  scramble: { title: "Word Scramble", render: () => <Scramble /> },
  flipGame: { title: "Flip Memory", render: () => <MemoryGame /> },
  anagram: { title: "Anagram Challenge", render: () => <AnagramGame /> },
};

// Session length in minutes (the "5-10 min" window). 7 sits in the middle.
const SESSION_MINUTES = 7;

export default function Games() {
  // view: "hub" | "gate" | "playing"
  const [view, setView] = useState("hub");
  const [activeGame, setActiveGame] = useState(null);
  // Bump to re-read localStorage-backed progress after an unlock.
  const [, setTick] = useState(0);

  function playGame(gameId) {
    setActiveGame(gameId);
    setView("playing");
  }

  // Called by ProverbGate on a correct read: unlock the next game and drop
  // straight into it.
  function handleUnlock() {
    const unlocked = unlockNext();
    setTick((t) => t + 1);
    if (unlocked) {
      playGame(unlocked);
    } else {
      setView("hub");
    }
  }

  function finishSession() {
    setActiveGame(null);
    setView("hub");
  }

  // Only meaningful to show the gate when there's still a game to unlock.
  if (view === "gate" && nextLockedGame()) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setView("hub")}>⬅ Back to Hub</button>
        <ProverbGate
          proverbIndex={getProverbIndex()}
          nextGameId={nextLockedGame()}
          onUnlock={handleUnlock}
        />
      </div>
    );
  }

  if (view === "playing" && activeGame) {
    return (
      <div style={{ padding: 20 }}>
        <GameSession
          title={GAME_META[activeGame].title}
          minutes={SESSION_MINUTES}
          onFinish={finishSession}
        >
          {GAME_META[activeGame].render()}
        </GameSession>
      </div>
    );
  }

  // Hub
  return (
    <div style={{ padding: 20 }}>
      <GamesHub
        onSelectGame={playGame}
        onStartGate={() => setView("gate")}
      />
      {allUnlocked() && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={() => {
              resetProgress();
              setTick((t) => t + 1);
            }}
          >
            🔄 Restart challenge with fresh proverbs
          </button>
        </div>
      )}
    </div>
  );
}
