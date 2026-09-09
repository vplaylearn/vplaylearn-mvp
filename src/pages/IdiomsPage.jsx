import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import IdiomCard from "../components/idiomCard/IdiomCard";
import "./idiomsPage.css";

const LANGUAGES = [
  { id: "english", label: "English", title: "English Proverbs", path: "/english-idioms", file: "english-idioms.json", key: "eng" },
  { id: "hindi", label: "Hindi", title: "Hindi Proverbs", path: "/hindi-idioms", file: "hindi-idioms.json", key: "hindi" },
  { id: "telugu", label: "Telugu", title: "Telugu Proverbs", path: "/telugu-idioms", file: "telugu-proverbs.json", key: "telugu" },
  { id: "tamil", label: "Tamil", title: "Tamil Proverbs", path: "/tamil-idioms", file: "tamil-proverbs.json", key: "tamil" },
  { id: "kannada", label: "Kannada", title: "Kannada Proverbs", path: "/kannada-idioms", file: "kannada-idioms.json", key: "kannada" },
];

export default function IdiomsPage() {
  const location = useLocation();
  const selectedLanguage = LANGUAGES.find((language) => language.path === location.pathname) || LANGUAGES[0];
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    fetch(`/data/${selectedLanguage.file}`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load proverbs.");
        return response.json();
      })
      .then((items) => {
        setData(items);
        setStatus("done");
      })
      .catch(() => {
        setData([]);
        setStatus("error");
      });
  }, [selectedLanguage]);

  return (
    <section className="idioms-page" aria-labelledby="idioms-title">
      <header className="idioms-header">
        <p className="idioms-eyebrow">Idioms and proverbs</p>
        <h1 id="idioms-title">Learn wisdom in every language.</h1>
        <p>Choose a language to explore its expressions and meanings.</p>
      </header>

      <nav className="idioms-tabs" aria-label="Idioms and proverb languages">
        {LANGUAGES.map((language) => (
          <NavLink
            key={language.id}
            to={language.path}
            className={({ isActive }) => (isActive ? "active" : "")}
            role="tab"
            aria-selected={selectedLanguage.id === language.id}
          >
            {language.label}
          </NavLink>
        ))}
      </nav>

      <div className="idioms-list" aria-live="polite">
        {status === "loading" && <p className="idioms-status">Loading {selectedLanguage.label} proverbs...</p>}
        {status === "error" && <p className="idioms-status error">Unable to load this language right now.</p>}
        {status === "done" && data.map((item, index) => (
          <IdiomCard key={item.id || `${selectedLanguage.id}-${index}`} item={item} language={selectedLanguage.key} />
        ))}
      </div>
    </section>
  );
}
