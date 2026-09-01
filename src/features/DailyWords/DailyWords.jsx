import { useState, useEffect, useCallback } from "react";
import "./dailyWords.css";

const AI_ENDPOINT = "/api/chat";
const STORAGE_KEY = "vpl_daily_words_history";
const MAX_HISTORY = 200; // cap stored words to avoid unbounded growth

// Read the list of words already shown to this user for a given language
function loadHistory(language = "english") {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${language}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Persist the history back to localStorage for a given language
function saveHistory(words, language = "english") {
  try {
    const trimmed = words.slice(-MAX_HISTORY);
    localStorage.setItem(`${STORAGE_KEY}_${language}`, JSON.stringify(trimmed));
  } catch {
    /* ignore quota errors */
  }
}

// Persist a full word object per-language so switching tabs can restore it
function saveWordObj(obj, language = "english") {
  try {
    localStorage.setItem(`${STORAGE_KEY}_obj_${language}`, JSON.stringify(obj));
  } catch {}
}

function loadSavedWord(language = "english") {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_obj_${language}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function DailyWords() {
  const [word, setWord] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [language, setLanguage] = useState("english");

  const LANGUAGES = [
    { id: "english", label: "English" },
    { id: "hindi", label: "Hindi" },
    { id: "telugu", label: "Telugu" },
    { id: "tamil", label: "Tamil" },
    { id: "kannada", label: "Kannada" },
  ];

  const fetchWord = useCallback(async (lang = language) => {
    setStatus("loading");
    setErrorMsg("");

    const history = loadHistory(lang);
    // Only send the most recent words to keep the prompt small
    const recentWords = history.slice(-40);

    const avoidList = recentWords.length
      ? `Do NOT use any of these already-used words: ${recentWords.join(", ")}.`
      : "";

    let prompt;
    if (lang === "english") {
      prompt = `You are a vocabulary teacher for school students. Give ONE interesting English word suitable for students to learn today. ${avoidList}\n\nRespond with ONLY valid JSON in this exact format:\n{"word":"the word","partOfSpeech":"noun/verb/adjective/etc","meaning":"simple student-friendly definition","example":"a clear example sentence using the word","synonyms":["syn1","syn2"]}`;
    } else {
      // For non-English languages request word + transliteration + meaning in English
      // Also include synonyms and an example transliteration field
      const langName = lang[0].toUpperCase() + lang.slice(1);
      prompt = `You are a vocabulary teacher for school students. Give ONE interesting ${langName} word suitable for students to learn today. ${avoidList}\n\nRespond with ONLY valid JSON in this exact format:\n{"word":"the word in ${langName}","transliteration":"romanized form (if applicable)","partOfSpeech":"noun/verb/adjective/etc","meaning":"simple student-friendly definition in English","example":"a clear example sentence using the word (in ${langName})","exampleTransliteration":"romanized example sentence","synonyms":["syn1","syn2"]}`;
    }

    try {
      const body = {
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: "Output ONLY a JSON object. No prose, no markdown, no thinking out loud. Be concise." },
          { role: "user", content: prompt },
        ],
        temperature: 0.9, // higher temp for more variety
        max_tokens: 1024,
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message;
      let content = message?.content || "";
      if (!content || (!content.includes("{") && message?.reasoning)) {
        content = message.reasoning || "";
      }
      if (!content) content = data.content || data.response || "";

      if (!content) throw new Error("No content in API response");

      // Extract and parse JSON
      let cleaned = content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) cleaned = jsonMatch[0];

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        // fix trailing commas and retry
        parsed = JSON.parse(cleaned.replace(/,\s*([}\]])/g, "$1"));
      }

      if (!parsed?.word) throw new Error("Response missing a word");

      // Record the word so it won't repeat (per-language)
      const updated = [...history, parsed.word.toLowerCase()];
      saveHistory(updated, lang);
      // Persist the full parsed object for the language so tab switches restore it
      saveWordObj(parsed, lang);

      setWord(parsed);
      setStatus("done");
    } catch (err) {
      console.error("DailyWords error:", err);
      setErrorMsg(err.name === "AbortError" ? "Request timed out. Try again." : err.message);
      setStatus("error");
    }
  }, []);

  // On mount or when language changes, restore saved word for that language if present
  useEffect(() => {
    const saved = loadSavedWord(language);
    if (saved) {
      setWord(saved);
      setStatus("done");
    } else {
      fetchWord(language);
    }
  }, [fetchWord, language]);

  return (
    <div className="daily-words">
      <div className="dw-header">
        <h3>📚 Word of the Day</h3>
        <div className="dw-tabs">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              className={`dw-tab ${language === l.id ? "active" : ""}`}
              onClick={() => setLanguage(l.id)}
              disabled={status === "loading" && language === l.id}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          className="dw-refresh"
          onClick={() => fetchWord(language)}
          disabled={status === "loading"}
          title="Get a new word"
        >
          {status === "loading" ? "…" : "🔄 New Word"}
        </button>
      </div>

      {status === "loading" && (
        <div className="dw-loading">
          <div className="dw-spinner"></div>
          <span>Finding a great word for you…</span>
        </div>
      )}

      {status === "error" && (
        <div className="dw-error">⚠️ {errorMsg}</div>
      )}

      {status === "done" && word && (
        <div className="dw-card">
          <div className="dw-word-row">
            <span className="dw-word">{word.word}</span>
            {word.partOfSpeech && <span className="dw-pos">{word.partOfSpeech}</span>}
          </div>
          <p className="dw-meaning">{word.meaning}</p>
          {word.transliteration && (
            <p className="dw-translit">{word.transliteration}</p>
          )}
          {word.example && (
            <>
              <p className="dw-example">"{word.example}"</p>
              {word.exampleTransliteration && (
                <p className="dw-example-translit">{word.exampleTransliteration}</p>
              )}
            </>
          )}
          {Array.isArray(word.synonyms) && word.synonyms.length > 0 && (
            <div className="dw-synonyms">
              <span className="dw-syn-label">Similar words:</span>
              {word.synonyms.map((s, i) => (
                <span className="dw-syn-chip" key={i}>{s}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
