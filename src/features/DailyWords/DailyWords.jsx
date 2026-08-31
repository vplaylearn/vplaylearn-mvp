import { useState, useEffect, useCallback } from "react";
import "./dailyWords.css";

const AI_ENDPOINT = "/api/chat";
const STORAGE_KEY = "vpl_daily_words_history";
const MAX_HISTORY = 200; // cap stored words to avoid unbounded growth

// Read the list of words already shown to this user
function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Persist the history back to localStorage
function saveHistory(words) {
  try {
    const trimmed = words.slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* ignore quota errors */
  }
}

export default function DailyWords() {
  const [word, setWord] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [errorMsg, setErrorMsg] = useState("");

  const fetchWord = useCallback(async () => {
    setStatus("loading");
    setErrorMsg("");

    const history = loadHistory();
    // Only send the most recent words to keep the prompt small
    const recentWords = history.slice(-40);

    const avoidList = recentWords.length
      ? `Do NOT use any of these already-used words: ${recentWords.join(", ")}.`
      : "";

    const prompt = `You are a vocabulary teacher for school students. Give ONE interesting English word suitable for students to learn today. ${avoidList}

Respond with ONLY valid JSON in this exact format:
{"word":"the word","partOfSpeech":"noun/verb/adjective/etc","meaning":"simple student-friendly definition","example":"a clear example sentence using the word","synonyms":["syn1","syn2"]}`;

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

      // Record the word so it won't repeat
      const updated = [...history, parsed.word.toLowerCase()];
      saveHistory(updated);

      setWord(parsed);
      setStatus("done");
    } catch (err) {
      console.error("DailyWords error:", err);
      setErrorMsg(err.name === "AbortError" ? "Request timed out. Try again." : err.message);
      setStatus("error");
    }
  }, []);

  // Fetch a word on first mount
  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  return (
    <div className="daily-words">
      <div className="dw-header">
        <h3>📚 Word of the Day</h3>
        <button
          className="dw-refresh"
          onClick={fetchWord}
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
          {word.example && (
            <p className="dw-example">"{word.example}"</p>
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
