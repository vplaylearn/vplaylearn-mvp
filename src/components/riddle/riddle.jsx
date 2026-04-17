import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import './riddle.css';

function RiddleCard({page}) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/riddles.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="riddle-card">
      <h2>Riddles</h2>

      <div className="riddle-items">
        {data.map((item,index) => (
          
            <span key={index}>{item.text}</span>
        
        ))}
      </div>
      {!page && <button className="riddles-btn" onClick={() => navigate("/riddles") }>
           check  answer and more
        </button> }
    </div>
  );
}

export default RiddleCard;