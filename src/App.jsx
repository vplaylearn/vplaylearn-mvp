import React from "react";
import { Routes, Route } from "react-router-dom";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import RightPane from "./components/RightPane.jsx";

import Home from "./pages/Home";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
//import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Puzzles from "./features/Puzzles/Puzzles.jsx";
import Games from "./pages/Games.jsx";

const App = () => {
  return (
    <div>
      <Topbar />

      <div style={styles.layout}>
        <Sidebar /> 

        <div style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/puzzles" element={<Puzzles />} />
                <Route path="/games" element={<Games />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          <Route path="/security" element={<Security />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sales" element={<Sales />} />
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
    marginLeft: "20px", // sidebar width
    marginRight: "25px", // right pane width
  },
};

export default App;