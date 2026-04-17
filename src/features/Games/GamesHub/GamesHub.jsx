import MiniCard from "../../../components/minicard/Minicard";
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

export default function GamesHub({ onSelectGame }) {
  return (
    <div className="hub-container">
        <h1 className="hub-title">Games Hub</h1>
        <p className="hub-subtitle">Choose a game to start playing</p>
     <div className="mini-grid">
      {gamesList.map((game) => (
        <MiniCard
          key={game.title}
          title={game.title}
          icon={game.icon}
          onClick={() => onSelectGame(game.id)}
        />
      ))}
    </div>
    </div>
    // <div className="hub-container">
    //   <h1 className="hub-title">Games Hub</h1>
    //   <p className="hub-subtitle">Choose a game to start playing</p>

    //   <div className="hub-grid">
    //     {gamesList.map((game) => (
    //       <div
    //         key={game.id}
    //         className="hub-card"
    //         onClick={() => onSelectGame(game.id)}
    //       >
    //         <div className="hub-icon">{game.icon}</div>
    //         <h2>{game.title}</h2>
    //         <p>{game.desc}</p>
    //         <button className="hub-btn">Play</button>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}