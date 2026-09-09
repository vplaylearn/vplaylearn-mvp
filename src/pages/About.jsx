import { NavLink } from "react-router-dom";
import "./about.css";

const FEATURES = [
  {
    title: "Build vocabulary",
    description: "Learn a fresh word each day, listen to its pronunciation, explore examples, and save useful words for revision.",
  },
  {
    title: "Explore language",
    description: "Search words across English, Hindi, Telugu, Tamil, and Kannada with meanings, examples, pronunciation, and similar words.",
  },
  {
    title: "Play and practise",
    description: "Use games, puzzles, riddles, jokes, and stories to make practice active, varied, and enjoyable.",
  },
  {
    title: "Write with confidence",
    description: "Writing Coach uses OCR and AI feedback to help turn handwritten notes into clearer, stronger writing.",
  },
];

export default function About() {
  return (
    <article className="about-page">
      <header className="about-hero">
        <p className="about-eyebrow">About vPlayLearn</p>
        <h1>Play and learn in one place.</h1>
        <p>
          vPlayLearn is a friendly learning space where curiosity becomes a daily habit through language, play, creativity, and practice.
        </p>
      </header>

      <section className="about-section" aria-labelledby="about-purpose-title">
        <p className="about-eyebrow">Our approach</p>
        <h2 id="about-purpose-title">Learning should feel active.</h2>
        <p>
          The app brings small, useful learning moments together so learners can move naturally between discovering a word, solving a puzzle, reading an idiom, playing a game, or improving a piece of writing.
        </p>
        <p>
          Each activity is designed to be easy to start and rewarding to revisit. Save the words and phrases that matter to you, then return to them whenever you want to practise again.
        </p>
      </section>

      <section className="about-feature-grid" aria-label="vPlayLearn features">
        {FEATURES.map((feature) => (
          <article className="about-feature" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="about-section about-languages" aria-labelledby="about-languages-title">
        <p className="about-eyebrow">Language and revision</p>
        <h2 id="about-languages-title">Keep learning in the language that feels right.</h2>
        <p>
          Explore idioms and proverbs in English, Hindi, Telugu, Tamil, and Kannada. Bookmark daily words, searched words, and phrases into separate categories, then filter them by language when you revise.
        </p>
      </section>

      <footer className="about-footer">
        <p>Ready to begin?</p>
        <NavLink to="/">Return to vPlayLearn</NavLink>
      </footer>
    </article>
  );
}
