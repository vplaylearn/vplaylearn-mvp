import { useEffect, useState } from "react";
import "./jokes.css";

export default function Jokes({ title, content }) {
  const [data, setData] = useState([]);
  console.log(content);

  useEffect(() => {
    fetch(`/data/${content}.json`)
      .then((res) => res.json())
      .then((res) => setData(res));
  }, [content]);

  return (
    <>
      <h2 className="quote-title">{title}</h2>

      {data.map((conv) => (
        <div className="chat-card" key={conv.conversationId}>
          <h3 className="chat-title">{conv.title}</h3>

          <div className="chat-messages">
            {conv.messages.map((msg) => (
              <div className="chat-bubble" key={msg.id}>
                <span className="chat-role">{msg.role}:</span>
                <span className="chat-text">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}