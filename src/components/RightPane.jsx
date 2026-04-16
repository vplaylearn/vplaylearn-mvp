import React from "react";

const RightPane = () => {
  return (
    <div style={styles.pane}>
      <h3>📊 Right Panel</h3>
      <p>Notifications, ads, or extra info goes here.</p>

      <ul>
        <li>🔔 Alert 1</li>
        <li>📌 Task update</li>
        <li>⚡ System status</li>
      </ul>
    </div>
  );
};

const styles = {
  pane: {
    width: "250px",
    height: "calc(100vh - 60px)",
    position: "fixed",
    right: 0,
    top: "60px",
    background: "#f3f4f6",
    borderLeft: "1px solid #ddd",
    padding: "15px",
  },
};

export default RightPane;