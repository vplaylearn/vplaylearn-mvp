import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./jokes.css";

export default function Jokes({ title, content , page }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/data/${content}.json`)
      .then((res) => res.json())
      .then((res) => setData(res));
  }, [content]);

  return (
    <>
      

      {data.map((conv) => (
        <div className="chat-card" key={conv.conversationId}>
          <h2 className="quote-title">{title}</h2>
          <h3 className="chat-title">{conv.title}</h3>

          <div className="chat-messages">
            {conv.messages.map((msg) => (
              <div className="chat-bubble" key={msg.id}>
                <span className="chat-role">{msg.role}:</span>
                <span className="chat-text">{msg.message}</span>
              </div>
            ))}
            
          </div>
          {!page && <button className="jokes-btn" onClick={() => 
            {window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
              navigate("/jokes")
          }}>
           More Jokes
        </button>}
        </div>
      ))}
      
    </>
  );
}