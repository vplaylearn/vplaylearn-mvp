import React, { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

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
import IdiomsPage from "./pages/IdiomsPage.jsx";
import WritingCoachPage from "./pages/WritingCoachPage.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div style={styles.layout}>
        {isSidebarOpen && (
          <button
            type="button"
            className="sidebar-overlay"
            aria-label="Close navigation"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div style={styles.main}>
          {location.pathname !== "/" && (
            <button
              type="button"
              className="route-back-button"
              onClick={() => navigate("/")}
            >
              <span aria-hidden="true">←</span> Back to Home
            </button>
          )}

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

          {/* Idoms Routes */}
           <Route path="/kannada-idioms" element={<IdiomsPage />} />
            <Route path="/tamil-idioms" element={<IdiomsPage />} />
            <Route path="/telugu-idioms" element={<IdiomsPage />} />
            <Route path="/hindi-idioms" element={<IdiomsPage />} />
            <Route path="/english-idioms" element={<IdiomsPage />} />

          {/* Writing Coach */}
          <Route path="/writing-coach" element={<WritingCoachPage />} />
            <Route path="/bookmarks" element={<Bookmarks />} />

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
    alignItems: "stretch",
    minHeight: "calc(100vh - 60px)",
  },
  main: {
    flex: 1,
    padding: "0px",
    marginLeft: "10px", // sidebar width
    marginRight: "10px", // right pane width
  },
};

export default App;