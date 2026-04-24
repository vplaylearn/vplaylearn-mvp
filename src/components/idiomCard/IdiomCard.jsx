import { useState } from "react";

export default function IdiomCard({ item , language}) {
  const [showMeaning, setShowMeaning] = useState(false);

  return (
    <div style={styles.card}>
      <h2 style={styles.kannada}>{item[language]}</h2>

      <p style={styles.transliteration}>
        {item.transliteration}
      </p>

      <p style={styles.english}>{item.english}</p>

      {showMeaning && (
        <p style={styles.meaning}>{item.meaning}</p>
      )}

      <button
        style={styles.button}
        onClick={() => setShowMeaning(!showMeaning)}
      >
        {showMeaning ? "Hide Meaning" : "Show Meaning"}
      </button>
    </div>
  );
}

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