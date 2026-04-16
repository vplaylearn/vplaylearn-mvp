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
      <h2 className="quote-title">{title}</h2>

      {data.map((item, i) => (
  <p key={i}>
    <strong>{item.title}</strong> — {item.author} ({item.language})  
    <a href={item.link}> Read</a>
  </p>
))}
    </>
  );
}