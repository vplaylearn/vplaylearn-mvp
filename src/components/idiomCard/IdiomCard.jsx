import { useState } from "react";
import { NavLink } from "react-router-dom";
import { isBookmarked, toggleBookmark } from "../../utils/bookmarks";

export default function IdiomCard({ item , language}) {
  const [showMeaning, setShowMeaning] = useState(false);
  const [, refreshBookmarks] = useState(0);
  const bookmarkId = `idiom:${language}:${item[language]}`;

  return (
    <div style={styles.card}>
      <div style={styles.headingRow}>
        <h2 style={styles.kannada}>{item[language]}</h2>
        <div style={styles.actions}>
          <button
            type="button"
            style={styles.bookmarkButton}
            onClick={() => {
              toggleBookmark({
                id: bookmarkId,
                type: "Idiom / phrase",
                language,
                title: item[language],
                subtitle: item.transliteration,
                description: item.english,
              });
              refreshBookmarks((value) => value + 1);
            }}
            aria-label="Bookmark this idiom"
          >
            {isBookmarked(bookmarkId) ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
          <NavLink to="/bookmarks?type=idiom" style={styles.viewBookmarks}>
            View bookmarks
          </NavLink>
        </div>
      </div>

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
  headingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px"
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end"
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
  },
  bookmarkButton: {
    padding: "6px 9px",
    border: "1px solid rgba(255,255,255,0.7)",
    borderRadius: "6px",
    background: "transparent",
    color: "#fff",
    cursor: "pointer"
  },
  viewBookmarks: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    border: "1px solid rgba(255,255,255,0.7)",
    borderRadius: "6px",
    background: "transparent",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    textDecoration: "none"
  }
};