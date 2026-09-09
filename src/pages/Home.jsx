import { useState } from "react";
import { NavLink } from "react-router-dom";
import DailyWords from "../features/DailyWords/DailyWords.jsx";
import WordSearch from "../features/WordSearch/WordSearch.jsx";
import "./home.css";

export default function Home() {
  const [wordSearchExpanded, setWordSearchExpanded] = useState(false);

  return (
    <div className="home-page">
      <header className="home-intro">
        <p className="home-eyebrow">vPlayLearn</p>
        <h1>Play and learn, every day.</h1>
        <p>Discover games, words, stories, and activities that make learning feel like play.</p>
      </header>

      <section className="home-learning-grid" aria-label="Daily learning activities">
        <DailyWords
          isCollapsed={wordSearchExpanded}
          onExpand={() => setWordSearchExpanded(false)}
        />
        <WordSearch
          isExpanded={wordSearchExpanded}
          onExpandedChange={setWordSearchExpanded}
        />
      </section>

      <section className="home-explore" aria-labelledby="explore-title">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">Keep exploring</p>
            <h2 id="explore-title">More ways to learn</h2>
          </div>
          <span>Choose your next activity</span>
        </div>

        <div className="home-explore-links">
          <NavLink to="/games">Games <span>Play</span></NavLink>
          <NavLink to="/puzzles">Puzzles <span>Solve</span></NavLink>
          <NavLink to="/jokes">Jokes <span>Laugh</span></NavLink>
          <NavLink to="/riddles">Riddles <span>Think</span></NavLink>
          <NavLink to="/writing-coach">Writing Coach <span>Create</span></NavLink>
          <NavLink to="/english-idioms">Idioms <span>Discover</span></NavLink>
        </div>
      </section>
    </div>
  );
}
