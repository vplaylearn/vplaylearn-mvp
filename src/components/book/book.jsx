import { useState } from "react";

export default function Card({ item }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const pages = item.pages || [
    "/images/page1.jpg",
    "/images/page2.jpg",
    "/images/page3.jpg",
  ];

  return (
    <>
      <p style={styles.text}>
        By {item.author}{" "}
        <button style={styles.linkBtn} onClick={() => setOpen(true)}>
          Read
        </button>
      </p>

      {open && (
        <div style={styles.overlay}>
          <div style={styles.viewer} onClick={(e) => e.stopPropagation()}>
            
            {/* Single Page */}
            <div style={styles.page}>
              <img src={pages[page]} alt="page" style={styles.image} />
            </div>

            {/* Controls */}
            <div style={styles.controls}>
              <button
                style={styles.navBtn}
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
              >
                ◀ Prev
              </button>

              <span style={styles.pageInfo}>
                {page + 1} / {pages.length}
              </span>

              <button
                style={styles.navBtn}
                disabled={page === pages.length - 1}
                onClick={() =>
                  setPage((p) => Math.min(p + 1, pages.length - 1))
                }
              >
                Next ▶
              </button>

              <button style={styles.navBtn} onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  text: {
    fontSize: "14px",
  },

  linkBtn: {
    background: "none",
    border: "none",
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  viewer: {
    width: "70vw",       // ✅ 70% screen
    height: "85vh",
    background: "#fdf6e3",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  page: {
    width: "100%",
    height: "100%",
    background: "#fff",
    borderRadius: "5px",
    overflow: "auto",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },

  image: {
    width: "100%",
    maxWidth: "700px",
    height: "auto",
    objectFit: "contain",
  },

  controls: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  navBtn: {
    cursor: "pointer",
    padding: "6px 12px",
  },

  pageInfo: {
    fontWeight: "bold",
  },
};