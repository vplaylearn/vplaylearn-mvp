const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { suggestion, email, website } = request.body || {};

  if (website) {
    return response.status(200).json({ ok: true });
  }

  if (typeof suggestion !== "string" || suggestion.trim().length < 5) {
    return response.status(400).json({ error: "Please enter a suggestion." });
  }

  if (suggestion.length > 2000) {
    return response.status(400).json({ error: "Suggestion is too long." });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: "Please enter a valid email address." });
  }

  if (!process.env.RESEND_API_KEY || !process.env.SUGGESTIONS_TO_EMAIL || !process.env.RESEND_FROM_EMAIL) {
    return response.status(500).json({ error: "Suggestion service is not configured." });
  }

  try {
    const emailPayload = {
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.SUGGESTIONS_TO_EMAIL,
      subject: "New vPlayLearn suggestion",
      text: `${suggestion.trim()}${email ? `\n\nSuggested by: ${email}` : "\n\nSuggested anonymously"}`,
    };

    if (email) emailPayload.replyTo = email;
    await resend.emails.send(emailPayload);

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Suggestion email failed", error);
    return response.status(500).json({ error: "Unable to send suggestion right now." });
  }
};
