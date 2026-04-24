import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import './riddle.css';

function RiddleCard({ page }) {
  const [data, setData] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/riddles.json")
      .then((res) => res.json())
      .then((data) => {
        let limitedData = data.slice(0, 2); console.log(limitedData);
        if (!page) setData(limitedData)
        else
          setData(data)
      }
      )
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  if (!data) return <p>Loading...</p>;
  return (
    <div className={page ? "riddle-page" : "riddle-card"}>
      <h2>Riddles</h2>

      <div className="riddle-items">
        {data.map((item, index) => (
          <>
            <span key={index}>{item.riddle}</span>
            {page && (
              <p key={index} style={styles.answer}>{item.answer}</p>
            )}

          </>

        ))}
      </div>
      {!page && <button className="riddles-btn" onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        navigate("/riddles")
      }}>
        check  answer and more
      </button>}

    </div>
  );
}

export default RiddleCard;

const styles = {
  card: {
    background: "#a0bc33",
    color: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },
  kannada: {
    fontSize: "22px",
    marginBottom: "8px"
  },
  transliteration: {
    fontStyle: "italic",
    color: "black"
  },
  english: {
    marginTop: "10px",
    fontWeight: "bold"
  },
  meaning: {
    marginTop: "10px",
    color: "#ccc"
  },
  button: {
    marginTop: "12px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};