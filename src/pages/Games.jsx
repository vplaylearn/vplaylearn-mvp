import { useState } from "react";
import Scramble from "../features/Games/Scramble/Scramble";
import GamesHub from "../features/Games/GamesHub/GamesHub";
import MemoryGame from "../features/Games/memory/Memory";
import AnagramGame from "../features/Games/Anagram/Anagram";



export default function Games() {

 const [game, setGame] = useState(null);
 
   if (game === null) {
    return <GamesHub onSelectGame={setGame} />;
  }

 
  return (
    <>
      <div style={{ padding: 20 }}>
      <button onClick={() => setGame(null)}>⬅ Back to Hub</button>

        {game === "scramble" && <div class="card-gloabl">
          <Scramble />
        </div>}
        {game === "flipGame" && <MemoryGame/>}
        {game === "anagram" && <AnagramGame/>}
      </div>
     {/* <div>
      <h2>Which game do you want to play?</h2>

      {gamesList.map((game) => (
        <button key={game.id} onClick={() => onSelect(game.id)}>
          {game.label}
        </button>
      ))}
    </div> */}
    {/* <h3>Which game you want to play</h3>
    <div class="card-global">
     <Scramble/>
    </div> */}
    </>
  );
}

