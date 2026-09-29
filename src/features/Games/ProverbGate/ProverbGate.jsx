import { useEffect, useRef, useState } from "react";
import { isCloseEnough } from "../../../utils/speechMatch";
import "./proverbGate.css";

// Reuse the app's existing proverb data. English is the reliable speech path,
// so this gate reads/checks the English line; the native line is shown for
// context only.
const PROVERBS_URL = "/data/tamil-proverbs.json";

export default function ProverbGate({ proverbIndex, nextGameId, onUnlock }) {
  const [proverbs, setProverbs] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | listening | pass | fail | error
  const [heard, setHeard] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetch(PROVERBS_URL)
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data)) setProverbs(data);
      })
      .catch(() => setError("Could not load proverbs."));

    // Warm up the voice list so "Hear it" uses a good voice on first click.
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    return () => {
      active = false;
      // Stop any in-flight recognition when unmounting.
      if (recognitionRef.current) recognitionRef.current.abort?.();
    };
  }, []);

  // Cycle through proverbs as the learner progresses; wrap around if they pass
  // the end of the list.
  const proverb = proverbs.length
    ? proverbs[proverbIndex % proverbs.length]
    : null;
  const target = proverb?.english || "";

  // Prefer a natural-sounding English voice. getVoices() is often empty on the
  // first call (voices load async), so pick from whatever is ready, falling
  // back to the browser default.
  function pickEnglishVoice() {
    const voices = window.speechSynthesis.getVoices();
    const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    // Named voices tend to sound better than the generic default.
    const preferred = ["Google US English", "Samantha", "Microsoft Aria", "Microsoft Zira"];
    for (const name of preferred) {
      const match = english.find((v) => v.name === name);
      if (match) return match;
    }
    return english.find((v) => v.localService) || english[0] || null;
  }

  function speakProverb() {
    if (!target || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(target);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const voice = pickEnglishVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    if (typeof window === "undefined") return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Speech input isn't supported in this browser. Try Chrome or Edge.");
      setStatus("error");
      return;
    }

    // Stop synthesis first — if the proverb is still being spoken, the mic can
    // pick it up or the browser blocks recognition.
    window.speechSynthesis?.cancel();

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true; // show partial so the user sees it's live
    recognition.maxAlternatives = 1;

    let gotResult = false;

    recognition.onstart = () => {
      setStatus("listening");
      setError("");
      setHeard("");
    };
    recognition.onresult = (event) => {
      // Concatenate results; the last final one is what we grade.
      let transcript = "";
      let isFinal = false;
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      transcript = transcript.trim();
      setHeard(transcript);
      if (isFinal) {
        gotResult = true;
        setStatus(isCloseEnough(transcript, target) ? "pass" : "fail");
      }
    };
    recognition.onerror = (event) => {
      // no-speech / aborted are transient: just let the user retry, no scary UI.
      if (event.error === "no-speech" || event.error === "aborted") {
        setStatus("idle");
        return;
      }
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone access is blocked. Allow mic permission and try again.");
      } else if (event.error === "network") {
        setError("Speech recognition needs internet. Check your connection.");
      } else {
        setError("Couldn't hear that clearly. Please try again.");
      }
      setStatus("error");
    };
    recognition.onend = () => {
      // Ended with no final result -> back to idle so the button is usable.
      if (!gotResult) setStatus((s) => (s === "listening" ? "idle" : s));
    };

    try {
      recognition.start();
    } catch {
      // start() throws if called while already running; ignore.
    }
  }

  if (error && !proverb) {
    return <div className="gate-wrap"><p className="gate-error">{error}</p></div>;
  }
  if (!proverb) {
    return <div className="gate-wrap"><p>Loading proverb…</p></div>;
  }

  return (
    <div className="gate-wrap">
      <p className="gate-eyebrow">Read &amp; repeat to unlock a game</p>
      <div className="gate-card">
        <p className="gate-english">“{proverb.english}”</p>
        {proverb.transliteration && (
          <p className="gate-translit">{proverb.transliteration}</p>
        )}
        {proverb.meaning && <p className="gate-meaning">{proverb.meaning}</p>}

        <div className="gate-actions">
          <button type="button" className="gate-btn" onClick={speakProverb}>
            🔊 Hear it
          </button>
          <button
            type="button"
            className="gate-btn gate-btn-primary"
            onClick={startListening}
            disabled={status === "listening"}
          >
            {status === "listening" ? "🎙 Listening…" : "🎙 Read it aloud"}
          </button>
        </div>

        {heard && (
          <p className="gate-heard">
            We heard: <em>“{heard}”</em>
          </p>
        )}

        {status === "fail" && (
          <p className="gate-feedback gate-feedback-fail">
            Not quite — try reading it again, matching the words.
          </p>
        )}
        {status === "error" && <p className="gate-feedback gate-feedback-fail">{error}</p>}

        {status === "pass" && (
          <div className="gate-success">
            <p className="gate-feedback gate-feedback-pass">🎉 Great reading!</p>
            <button
              type="button"
              className="gate-btn gate-btn-primary"
              onClick={() => onUnlock(nextGameId)}
            >
              Unlock &amp; play →
            </button>
          </div>
        )}
      </div>
      <p className="gate-hint">Speech reading works best in Chrome or Edge.</p>
    </div>
  );
}
