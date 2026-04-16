import { useState } from "react";
import "./dice3d.css";

export default function Dice3D() {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (rolling) return;

    setRolling(true);

    const random = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      setValue(random);
      setRolling(false);
    }, 2000);
  };

  return (
    <div className="container">
      <h2> Roll the dice to get the required number of puzzles</h2>

      <div className={`scene ${rolling ? "rolling" : ""}`}>
        <div className={`cube show-${value}`}>
          <div className="face front">1</div>
          <div className="face back">6</div>
          <div className="face right">3</div>
          <div className="face left">4</div>
          <div className="face top">5</div>
          <div className="face bottom">2</div>
        </div>
      </div>

      <button onClick={rollDice}>
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>

      <h3>Result: {value}</h3>
    </div>
  );
}