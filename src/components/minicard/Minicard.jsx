import "./minicard.css";

export default function MiniCard({ title, icon, onClick }) {
  return (
    <div className="mini-card" onClick={onClick}>
      <div className="mini-icon">{icon}</div>
      <div className="mini-title">{title}</div>
    </div>
  );
}