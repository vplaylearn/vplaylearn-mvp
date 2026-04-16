import { useEffect, useState } from "react";
import "./puzzles.css"

function Puzzles() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/puzzles.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="puzzle-card">
      <h2>Puzzles</h2>

      <div className="puzzle-items">
        {data.map((item) => (
          <div className="puzzle-item" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Puzzles;