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
      <h2 className="quote-title">{title}</h2>

      <div className="quote-card">
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