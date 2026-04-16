import { useEffect, useState } from "react";
import "./puzzles.css";
import Dice3D from "../components/dice/dice";

function Puzzles() {
  const [data, setData] = useState(null);
  const [visibleId, setVisibleId] = useState(null);

  useEffect(() => {
    fetch("/data/puzzles.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  const toggle = (id) => {
    setVisibleId((prev) => (prev === id ? null : id));
  };

  if (!data) return <p>Loading...</p>;

  return (
    <>
    {/* <Dice3D/> roll dice to get required number of puzzles */}
    {/* Query the category of puzzles */}
    <div className="puzzle-card">
      <h2>Puzzles</h2>

      <div className="puzzle-items">
        {data.map((item) => (
          <div className="puzzle-item" key={item.id}>
            <div className="puzzle-header">
            <h3>{item.title}</h3>

            <button
              className="toggle-btn"
              onClick={() => toggle(item.id)}
            >
              {visibleId === item.id ? "Hide Description" : "Show Description"}
            </button>
            </div>

            {visibleId === item.id && (
              <p className="desc">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default Puzzles;