import React from "react";
import AuthButton from "./AuthButton";

const Topbar = ({ onMenuClick }) => {
  return (
    <div style={styles.topbar}>
      <button
        type="button"
        className="sidebar-menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        title="Open navigation"
      >
        <span aria-hidden="true">☰</span>
      </button>
      <h2 style={styles.title}>vPlayLearn</h2>
      <div style={styles.spacer} />
      <AuthButton />
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
  title: {
    margin: 0,
  },
  spacer: {
    flex: 1,
  },
};

export default Topbar;
