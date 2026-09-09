import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./wordSearch.css";
import { isBookmarked, toggleBookmark } from "../../utils/bookmarks";

const AI_ENDPOINT = "/api/chat";
const LANGUAGES = [
  { id: "english", label: "English", character: "EN" },
  { id: "hindi", label: "Hindi", character: "HI" },
  { id: "telugu", label: "Telugu", character: "TE" },
  { id: "tamil", label: "Tamil", character: "TA" },
  { id: "kannada", label: "Kannada", character: "KN" },
];
const WIKTIONARY_CODES = {
  english: "en",
  hindi: "hi",
  telugu: "te",
  tamil: "ta",
  kannada: "kn",
};
const SPEECH_LANGUAGES = {
  english: "en-US",
  hindi: "hi-IN",
  telugu: "te-IN",
  tamil: "ta-IN",
  kannada: "kn-IN",
};

export default function WordSearch({ isExpanded: expandedProp, onExpandedChange }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [language, setLanguage] = useState("english");
  const [isListening, setIsListening] = useState(false);
  const [, refreshBookmarks] = useState(0);
  const isExpanded = expandedProp ?? internalExpanded;

  function toggleExpanded() {
    const nextExpanded = !isExpanded;
    setInternalExpanded(nextExpanded);
    onExpandedChange?.(nextExpanded);
  }

  function speakText(text, speechLanguage = language) {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANGUAGES[speechLanguage] || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const languageCode = utterance.lang.toLowerCase();
    const voice = voices.find((item) => item.lang.toLowerCase().startsWith(languageCode))
      || voices.find((item) => item.lang.toLowerCase().startsWith(languageCode.split("-")[0]));
    if (voice) utterance.voice = voice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function startSpeechToText() {
    if (typeof window === "undefined") return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Speech input is not supported in this browser.");
      setStatus("error");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = SPEECH_LANGUAGES[language] || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) setQuery(transcript);
    };
    recognition.onerror = () => {
      setError("Could not recognize speech. Please try again.");
      setStatus("error");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }

  async function searchWord(event) {
    event.preventDefault();
    const word = query.trim();

    if (!word) {
      setError("Enter a word to search.");
      setResult(null);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const languageLabel = LANGUAGES.find((item) => item.id === language)?.label || "English";
      const prompt = `Give a concise dictionary entry for the ${languageLabel} word "${word}". Keep the word, example, and synonyms in the native ${languageLabel} script when applicable. Write the definition in simple English. Respond with ONLY valid JSON in this exact format: {"word":"the word in ${languageLabel}","phonetic":"pronunciation if known","partOfSpeech":"noun/verb/adjective/etc","definition":"clear student-friendly definition in English","example":"one natural example sentence in ${languageLabel}","synonyms":["synonym1","synonym2"]}`;
      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages: [
            { role: "system", content: "Output ONLY a JSON object. No prose, markdown, or extra text." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}.`);
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message;
      let content = message?.content || data.content || data.response || "";
      if (Array.isArray(content)) {
        content = content.map((part) => part?.text || part?.content || "").join("");
      }
      if (typeof content !== "string") content = JSON.stringify(content);
      if (message?.reasoning && !content.includes("{")) content = message.reasoning;
      if (!content) throw new Error("The AI returned an empty response.");

      let cleaned = content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("The AI returned an incomplete dictionary response. Please try again.");
      }
      cleaned = jsonMatch ? jsonMatch[0] : cleaned;

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = JSON.parse(cleaned.replace(/,\s*([}\]])/g, "$1"));
      }

      if (!parsed?.word || !parsed?.definition) {
        throw new Error("No definition was found for that word.");
      }

      setResult({
        word: parsed.word,
        phonetic: parsed.phonetic || "",
        partOfSpeech: parsed.partOfSpeech || "",
        definition: parsed.definition,
        example: parsed.example || "",
        synonyms: Array.isArray(parsed.synonyms)
          ? parsed.synonyms
          : typeof parsed.synonyms === "string"
            ? parsed.synonyms.split(",").map((synonym) => synonym.trim()).filter(Boolean)
            : [],
        language: languageLabel,
          wikiCode: WIKTIONARY_CODES[language] || "en",
      });
      setStatus("done");
    } catch (searchError) {
      setResult(null);
      setError(searchError.message || "Unable to search right now.");
      setStatus("error");
    }
  }

  return (
    <section className={`word-search ${isExpanded ? "" : "is-collapsed"}`} aria-labelledby="word-search-title">
      <div className="word-search-header">
        <div>
          <p className="word-search-eyebrow">Explore language</p>
          <h2 id="word-search-title">Word Search</h2>
        </div>
        <div className="word-search-header-actions">
          <NavLink className="word-search-bookmarks-link" to="/bookmarks?type=searched" title="View searched word bookmarks">
            <span aria-hidden="true">★</span> View bookmarks
          </NavLink>
          <span
            className="word-search-mark multilingual"
            title="Multiple language word search"
            role="img"
            aria-label="English, Hindi, Kannada, Tamil, and Telugu word search"
          >
            <span title="English">A</span>
            <span title="Hindi">अ</span>
            <span title="Kannada">ಅ</span>
            <span title="Tamil">அ</span>
            <span title="Telugu">అ</span>
          </span>
          <button
            type="button"
            className="word-search-toggle"
            onClick={toggleExpanded}
            aria-expanded={isExpanded}
            aria-controls="word-search-content"
          >
            {isExpanded ? "Collapse" : "Search"}
          </button>
        </div>
      </div>

      <div id="word-search-content" hidden={!isExpanded}>
        <form className="word-search-form" onSubmit={searchWord}>
        <div className="word-search-form-topline">
          <label className="word-search-label" htmlFor="word-search-input">
            Look up a word
          </label>
          <div className="word-search-language-tabs" role="tablist" aria-label="Search language">
            {LANGUAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={language === item.id}
                className={language === item.id ? "active" : ""}
                onClick={() => setLanguage(item.id)}
                title={item.label}
                aria-label={item.label}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="word-search-controls">
          <input
            id="word-search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: curious"
            autoComplete="off"
          />
          <button
            type="button"
            className={`word-search-mic ${isListening ? "active" : ""}`}
            onClick={startSpeechToText}
            disabled={isListening || status === "loading"}
            aria-label={isListening ? "Listening" : "Search by voice"}
            title={isListening ? "Listening..." : "Search by voice"}
          >
            {isListening ? "●" : "🎙️"}
          </button>
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Searching..." : "Search"}
          </button>
        </div>
        </form>

        {status === "error" && <p className="word-search-message error">{error}</p>}

        {status === "done" && result && (
          <article className="word-search-result" aria-live="polite">
          <div className="word-search-result-heading">
            <div>
              <div className="word-search-word-line">
                <h3>{result.word}</h3>
                <button
                  type="button"
                  className="word-search-bookmark"
                  onClick={() => {
                    const bookmarkId = `searched-word:${result.wikiCode}:${result.word}`;
                    toggleBookmark({
                      id: bookmarkId,
                      type: "Searched word",
                      language: result.language,
                      title: result.word,
                      subtitle: result.partOfSpeech,
                      description: result.definition,
                      example: result.example,
                      phonetic: result.phonetic,
                      synonyms: result.synonyms,
                    });
                    refreshBookmarks((value) => value + 1);
                  }}
                  aria-label="Bookmark this searched word"
                  title="Bookmark this word"
                >
                  {isBookmarked(`searched-word:${result.wikiCode}:${result.word}`) ? "★" : "☆"}
                </button>
                <button
                  type="button"
                  className="word-search-voice"
                  onClick={() => speakText(result.word)}
                  aria-label={`Read ${result.word} aloud`}
                  title={`Read ${result.word} aloud`}
                >
                  🔊
                </button>
              </div>
              <p>{[result.language, result.phonetic, result.partOfSpeech].filter(Boolean).join(" · ")}</p>
            </div>
            <a
              href={`https://${result.wikiCode}.wiktionary.org/wiki/${encodeURIComponent(result.word)}`}
              target="_blank"
              rel="noreferrer"
              className="word-search-reference"
            >
              Open reference
            </a>
          </div>
          <div className="word-search-text-row">
            <p className="word-search-definition">{result.definition}</p>
            <button
              type="button"
              className="word-search-voice small"
              onClick={() => speakText(result.definition, "english")}
              aria-label="Read definition aloud"
              title="Read definition aloud"
            >
              🔊
            </button>
          </div>
          {result.example && (
            <div className="word-search-text-row">
              <p className="word-search-example">“{result.example}”</p>
              <button
                type="button"
                className="word-search-voice small"
                onClick={() => speakText(result.example)}
                aria-label="Read example aloud"
                title="Read example aloud"
              >
                🔊
              </button>
            </div>
          )}
          {result.synonyms.length > 0 && (
            <div className="word-search-synonyms">
              <span>Similar:</span>
              {result.synonyms.slice(0, 6).map((synonym) => (
                <span className="word-search-chip" key={synonym}>
                  {synonym}
                  <button
                    type="button"
                    className="word-search-mini-voice"
                    onClick={() => speakText(synonym)}
                    aria-label={`Read ${synonym} aloud`}
                    title={`Read ${synonym} aloud`}
                  >
                    🔊
                  </button>
                </span>
              ))}
            </div>
          )}
          </article>
        )}
      </div>
    </section>
  );
}
