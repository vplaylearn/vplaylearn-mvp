import { useEffect, useState } from "react";
import "./publishedStories.css";

export default function PublishedStories({ title, content }) {
  const [data, setData] = useState([]);

  const loadData = () => {
    fetch(`/data/${content}.json`)
      .then((res) => res.json())
      .then((res) => setData(res));
  };

  useEffect(() => {
    loadData();
  }, [content]);

  const quote =
    data.length > 0
      ? data[Math.floor(Math.random() * data.length)]
      : null;

  return (
    <>
      {/* <h2 className="quote-title">{title}</h2> */}
    <div style={styles.card}>
      <h2 className="quote-title">{title}</h2>
      {data.map((item, index) => (
        <>
          <h3 style={styles.title}>{item.title}</h3>
          <p style={styles.text}>By {item.author}<span><a href={item.link}> Read</a></span></p>         
        </>
        ))}
        <button className="stories-btn" >
           More stories
        </button>
        </div>
    </>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    padding: "20px",
  },
  card: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #e5e5e5",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "16px",
    marginBottom: "6px",
  },
  text: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "6px",
  },
  tag: {
    fontSize: "11px",
    padding: "3px 8px",
    background: "#f2f2f2",
    borderRadius: "6px",
    display: "inline-block",
  },
};