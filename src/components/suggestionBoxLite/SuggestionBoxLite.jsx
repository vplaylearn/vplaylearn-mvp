import { useState } from "react";
import "./suggestionBoxLite.css";

export default function SuggestionBoxLite() {
  const [form, setForm] = useState({
    name: "",
    email: "",
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
        body:  JSON.stringify({
          name: form.name,
          email: form.email,
          suggestion: form.message,
          website: "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send message.");
      }

      setForm({
        name: "",
        email: "",
        message: "",
      });

      setStatus("sent");
      setFeedback("Thanks! Your message was sent.");
    } catch (error) {
      setStatus("error");
      setFeedback(error.message);
    }
  }

  return (
    <section className="suggestion-box-lite">
      <div className="suggestion-box-lite-heading">
        <p className="about-eyebrow">Get in touch</p>
        {/* <h2>Have a suggestion?</h2> */}
        <p>We'd love to hear your ideas and feedback.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="suggestion-box-lite-fields">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name (optional)"
            autoComplete="name"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="For a reply, enter your email (optional)"
            autoComplete="email"
          />
        </div>

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your suggestion or message..."
          maxLength={2000}
          rows={4}
          required
        />

        <div className="suggestion-box-lite-action">
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send"}
          </button>

          {feedback && (
            <span className={`suggestion-box-lite-feedback ${status}`}>
              {feedback}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
