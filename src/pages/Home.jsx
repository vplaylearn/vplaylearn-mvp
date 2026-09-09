import { NavLink } from "react-router-dom";
import DailyWords from "../features/DailyWords/DailyWords.jsx";
import WordSearch from "../features/WordSearch/WordSearch.jsx";
import "./home.css";

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-intro">
        <p className="home-eyebrow">Your learning space</p>
        <h1>Make a little progress today.</h1>
        <p>Build your vocabulary, explore a word, and try a quick language activity.</p>
      </header>

      <section className="home-learning-grid" aria-label="Daily learning activities">
        <DailyWords />
        <WordSearch isExpanded={true} />
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
