import React from "react";
import { Routes, Route } from "react-router-dom";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import RightPane from "./components/RightPane.jsx";

import Home from "./pages/Home";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <div>
      <Topbar />

      <div style={styles.layout}>
        <Sidebar />

        <div style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>

        <RightPane />
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: "flex",
    marginTop: "60px",
  },
  main: {
    flex: 1,
    padding: "20px",
    marginLeft: "220px", // sidebar width
    marginRight: "250px", // right pane width
  },
};

export default App;