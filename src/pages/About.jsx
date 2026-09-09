import { useRef, useState } from "react";
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
  const [suggestion, setSuggestion] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);

  function startSpeechToText() {
    if (isListening) {
      shouldKeepListeningRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setStatus("error");
      setMessage("Speech input is not supported in this browser.");
      return;
    }

    const recognition = new Recognition();
  recognitionRef.current = recognition;
  shouldKeepListeningRef.current = true;
    recognition.lang = "en-US";
  recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setIsListening(true);
      setMessage("");
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setSuggestion((current) => `${current}${current ? " " : ""}${transcript}`);
      }
    };
    recognition.onerror = () => {
      shouldKeepListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
      setStatus("error");
      setMessage("Could not recognize speech. Please try again.");
    };
    recognition.onend = () => {
      if (shouldKeepListeningRef.current) {
        try {
          recognition.start();
        } catch {
          shouldKeepListeningRef.current = false;
          setIsListening(false);
          recognitionRef.current = null;
        }
      } else {
        setIsListening(false);
        recognitionRef.current = null;
      }
    };
    recognition.start();
  }

  async function submitSuggestion(event) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion, email, website: "" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send suggestion.");
      setSuggestion("");
      setEmail("");
      setStatus("sent");
      setMessage("Thanks. Your suggestion was sent.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

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

      <section className="about-suggestion" aria-labelledby="suggestion-title">
        <p className="about-eyebrow">Help shape vPlayLearn</p>
        <h2 id="suggestion-title">Have a suggestion?</h2>
        <p>Tell us what would make play and learning more useful for you.</p>
        <form onSubmit={submitSuggestion}>
          <label className="suggestion-email-label" htmlFor="suggestion-email">
            Email address <span>(optional)</span>
          </label>
          <input
            id="suggestion-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="For a reply, enter your email"
            autoComplete="email"
          />
          <div className="suggestion-input-wrap">
            <textarea
              value={suggestion}
              onChange={(event) => setSuggestion(event.target.value)}
              placeholder="Share an idea, activity, or improvement..."
              maxLength={2000}
              required
              aria-label="Your suggestion"
            />
            <button
              type="button"
              className={`suggestion-mic ${isListening ? "active" : ""}`}
              onClick={startSpeechToText}
              disabled={status === "sending"}
              aria-label={isListening ? "Stop speech to text" : "Start speech to text"}
              title={isListening ? "Stop speech to text" : "Start speech to text"}
            >
              {isListening ? "■ Stop" : "🎙️ Start"}
            </button>
          </div>
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send suggestion"}
          </button>
        </form>
        {message && <p className={`suggestion-message ${status}`}>{message}</p>}
      </section>

      <footer className="about-footer">
        <p>Ready to begin?</p>
        <NavLink to="/">Return to vPlayLearn</NavLink>
      </footer>
    </article>
  );
}
