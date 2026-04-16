import { useEffect, useState } from "react";
import "./Quotations.css";

export default function Quotation({ title, content }) {
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
    <div className="quote-card">
      <h2 className="quote-title">{title}</h2>

        <p className="quote-text">
          {quote ? quote.quote || quote : "Loading..."}
        </p>

        <button className="quote-btn" onClick={loadData}>
           More Quote
        </button>
      </div>
    </>
  );
}