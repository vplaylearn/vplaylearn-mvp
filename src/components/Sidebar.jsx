import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <Link to="/">Dashboard</Link>
      <Link to="/users">Users</Link>
      <Link to="/settings">Settings</Link>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#111827",
    color: "white",
    paddingTop: "80px",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    paddingLeft: "20px",
  },
};

export default Sidebar;