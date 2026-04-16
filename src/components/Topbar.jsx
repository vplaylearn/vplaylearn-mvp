import React from "react";

const Topbar = () => {
  return (
    <div style={styles.topbar}>
      <h2>My Dashboard</h2>
    </div>
  );
};

const styles = {
  topbar: {
    height: "60px",
    background: "#1f2937",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
};

export default Topbar;