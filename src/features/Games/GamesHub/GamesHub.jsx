import MiniCard from "../../../components/minicard/Minicard";
import { isUnlocked, nextLockedGame } from "../../../utils/gameProgress";
import "./gameshub.css";

const gamesList = [
  {
    id: "scramble",
    title: "Word Scramble",
    desc: "Unscramble hidden words",
    icon: "🔤",
  },
  {
    id: "flipGame",
    title: "Flip Memory",
    desc: "Match and remember cards",
    icon: "🃏",
  },
  {
    id: "anagram",
    title: "Anagram Challenge",
    desc: "Find hidden word patterns",
    icon: "🧠",
  },
];

// onSelectGame: play an already-unlocked game.
// onStartGate: begin the read-a-proverb flow to unlock the next game.
export default function GamesHub({ onSelectGame, onStartGate }) {
  const next = nextLockedGame();

  return (
    <div className="hub-container">
      <h1 className="hub-title">Games Hub</h1>
      <p className="hub-subtitle">Read a proverb aloud to unlock each game</p>

      {next && (
        <button type="button" className="hub-unlock-cta" onClick={onStartGate}>
          🎙 Read a proverb to unlock the next game
        </button>
      )}

      <div className="mini-grid">
        {gamesList.map((game) => {
          const unlocked = isUnlocked(game.id);
          return (
            <div
              key={game.id}
              className={`hub-slot ${unlocked ? "" : "hub-slot-locked"}`}
            >
              <MiniCard
                title={unlocked ? game.title : `${game.title} 🔒`}
                icon={unlocked ? game.icon : "🔒"}
                onClick={() => (unlocked ? onSelectGame(game.id) : onStartGate())}
              />
              {!unlocked && <span className="hub-lock-note">Locked — read a proverb</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
