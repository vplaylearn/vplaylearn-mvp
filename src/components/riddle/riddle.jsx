import { useEffect, useState } from "react";
import './riddle.css';

function RiddleCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/riddles.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>Riddles</h2>

      <div className="items">
        {data.map((item) => (
          
            <span>{item.text}</span>
        
        ))}
      </div>
      <button className="riddles-btn" >
           check  answer and more
        </button>
    </div>
  );
}

export default RiddleCard;