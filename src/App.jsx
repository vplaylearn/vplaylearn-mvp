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
import Story from "./pages/Story.jsx";
import PublishedStories from "./pages/PublishedStoriesPage.jsx";
import PublishedStoriesPage from "./pages/PublishedStoriesPage.jsx";
import RiddlesPage from "./pages/RiddlesPage.jsx";
import JokesPage from "./pages/JokesPage.jsx";

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
          <Route path="/story" element={<Story />} />

          {/* more button routes */}
          <Route path="/stories" element={<PublishedStoriesPage />} />
          <Route path="/riddles" element={<RiddlesPage />} />
          <Route path="/jokes" element={<JokesPage />} />
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