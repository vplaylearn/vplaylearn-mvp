// components/Suggestion.jsx
import { useState } from "react";
import "./suggestion.css";

export default function Suggestion() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "Suggestion",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your message.");
      }

      setForm({
        name: "",
        email: "",
        type: "Suggestion",
        message: "",
      });

      setStatus("sent");
      setFeedback("Thanks! Your message has been sent.");
    } catch (error) {
      setStatus("error");
      setFeedback(error.message);
    }
  }

  return (
    <section className="suggestion-section" aria-labelledby="suggestion-title">
      <div className="suggestion-header">
        <p className="about-eyebrow">Get in touch</p>

        <h2 id="suggestion-title">
          Have an idea? We'd love to hear it.
        </h2>

        <p>
          Send us a suggestion, report a problem, or tell us how we can
          make vPlayLearn better.
        </p>
      </div>

      <form className="suggestion-form" onSubmit={handleSubmit}>
        <div className="suggestion-row">
          <div className="suggestion-field">
            <label htmlFor="suggestion-name">
              Name <span>(optional)</span>
            </label>

            <input
              id="suggestion-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div className="suggestion-field">
            <label htmlFor="suggestion-email">
              Email <span>(optional)</span>
            </label>

            <input
              id="suggestion-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="suggestion-field">
          <label htmlFor="suggestion-type">
            What would you like to share?
          </label>

          <select
            id="suggestion-type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="Suggestion">Suggestion</option>
            <option value="Feedback">Feedback</option>
            <option value="Bug Report">Bug report</option>
            <option value="Content Request">Content request</option>
            <option value="General">General enquiry</option>
          </select>
        </div>

        <div className="suggestion-field">
          <label htmlFor="suggestion-message">
            Message
          </label>

          <textarea
            id="suggestion-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us what you have in mind..."
            maxLength={2000}
            rows={6}
            required
          />

          <div className="suggestion-counter">
            {form.message.length}/2000
          </div>
        </div>

        <div className="suggestion-submit">
          <button
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
        </div>
      </form>

      {feedback && (
        <p
          className={`suggestion-feedback ${status}`}
          role={status === "error" ? "alert" : "status"}
        >
          {feedback}
        </p>
      )}
    </section>
  );
}
