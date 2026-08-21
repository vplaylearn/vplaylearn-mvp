import { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import "./writingCoach.css";

const AI_ENDPOINT = "/api/chat";

export default function WritingCoach() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [corrections, setCorrections] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ocr | analyzing | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef(null);

  // Handle file selection
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMsg("Please upload an image (JPG, PNG, WebP) or PDF file.");
      return;
    }

    setFile(selectedFile);
    setErrorMsg("");
    setCorrections(null);
    setExtractedText("");
    setStatus("idle");

    // Create preview
    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreview({ type: "image", url });
    } else {
      setPreview({ type: "pdf", name: selectedFile.name });
    }
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  // OCR: Extract text from image
  const extractText = async () => {
    if (!file) return;
    setStatus("ocr");
    setErrorMsg("");

    try {
      if (file.type.startsWith("image/")) {
        const worker = await createWorker("eng");
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        setExtractedText(text);
        setStatus("idle");
      } else if (file.type === "application/pdf") {
        // For PDF: use pdfjs-dist to extract text
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n\n";
        }

        setExtractedText(fullText.trim());
        setStatus("idle");
      }
    } catch (err) {
      console.error("OCR Error:", err);
      setErrorMsg("Failed to extract text. Please try a clearer image.");
      setStatus("error");
    }
  };

  // AI: Analyze grammar
  const analyzeGrammar = async () => {
    if (!extractedText.trim()) return;
    setStatus("analyzing");
    setErrorMsg("");

    // Sanitize text - remove problematic characters from OCR
    const sanitizedText = extractedText
      .replace(/[^\x20-\x7E\n\r\t]/g, " ") // keep only printable ASCII + newlines
      .replace(/[ \t]+/g, " ") // collapse spaces but keep newlines
      .trim()
      .substring(0, 1000); // limit length — reasoning models need room to respond

    // Add line numbers so AI can reference them
    const numberedLines = sanitizedText.split("\n").map((line, i) => `${i + 1}: ${line}`).join("\n");

    const prompt = `Analyze this student's handwritten text (extracted via OCR). OCR may misread letters. Fix OCR errors using context, then check grammar.

Lines are numbered. Reference line numbers in corrections. List up to 10 corrections and up to 3 alternative phrasings.

Respond with ONLY valid JSON in this exact format:
{"reconstructed":"the full corrected text","summary":"one sentence assessment","corrections":[{"line":1,"original":"wrong phrase","suggested":"correct phrase","explanation":"brief reason"}],"alternatives":[{"line":1,"original":"original sentence","alternative":"improved version","note":"brief reason"}]}

Student text:
${numberedLines}`;

    try {
      const body = {
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: "Output ONLY a JSON object. No prose, no markdown, no thinking out loud. Be concise." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 4096,
      };

      console.log("Sending request to AI...", AI_ENDPOINT);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        console.error("API error response:", errText);
        throw new Error(`API returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      console.log("API response data:", data);

      const message = data.choices?.[0]?.message;
      // Prefer content over reasoning; reasoning models put thinking in reasoning field
      let content = message?.content || "";
      
      // If content is empty or doesn't contain JSON, try reasoning field
      if (!content || (!content.includes("{") && message?.reasoning)) {
        content = message.reasoning;
      }
      
      // Fallback to other response formats
      if (!content) {
        content = data.content || data.response || "";
      }
      
      console.log("Extracted content:", content.substring(0, 500));

      if (!content) {
        throw new Error("No content in API response");
      }

      // Robust JSON parsing - handle malformed responses from smaller models
      let parsed = null;
      let cleaned = content;
      cleaned = cleaned.replace(/```json\s*/gi, "");
      cleaned = cleaned.replace(/```\s*/g, "");
      cleaned = cleaned.trim();

      // Try to extract the outermost JSON object
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }

      console.log("Cleaned for parsing:", cleaned.substring(0, 300));

      // Attempt 1: direct parse
      try {
        parsed = JSON.parse(cleaned);
      } catch (e1) {
        console.warn("Direct parse failed, attempting fixes...", e1.message);

        // Attempt 2: fix common issues - trailing commas, unclosed arrays/objects
        let fixed = cleaned;
        // Remove trailing commas before ] or }
        fixed = fixed.replace(/,\s*([}\]])/g, "$1");
        // Try to close unclosed arrays/objects
        const openBraces = (fixed.match(/\{/g) || []).length;
        const closeBraces = (fixed.match(/\}/g) || []).length;
        const openBrackets = (fixed.match(/\[/g) || []).length;
        const closeBrackets = (fixed.match(/\]/g) || []).length;

        for (let i = 0; i < openBrackets - closeBrackets; i++) fixed += "]";
        for (let i = 0; i < openBraces - closeBraces; i++) fixed += "}";

        try {
          parsed = JSON.parse(fixed);
        } catch (e2) {
          console.warn("Fixed parse failed, attempting truncated parse...", e2.message);

          // Attempt 3: find the last valid closing brace and truncate
          let lastValid = null;
          for (let end = fixed.length; end > 100; end--) {
            const substr = fixed.substring(0, end);
            try {
              lastValid = JSON.parse(substr);
              break;
            } catch (_) {}
          }

          if (lastValid) {
            parsed = lastValid;
          }
        }
      }

      if (!parsed) {
        // Last resort: extract what we can and build a response
        parsed = {
          reconstructed: "",
          summary: "The AI returned a response but it could not be fully parsed. Here is the raw feedback:",
          corrections: [],
          alternatives: [],
          rawResponse: content.substring(0, 1500),
        };
      }

      setCorrections(parsed);
      setStatus("done");
    } catch (err) {
      console.error("AI Error:", err);
      setErrorMsg(`Failed to analyze text: ${err.message}`);
      setStatus("error");
    }
  };

  // Save results as PDF
  const saveAsPDF = () => {
    if (!corrections) return;

    const pdfContent = `
      <html>
      <head>
        <title>Writing Coach Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
          h2 { color: #334155; margin-top: 24px; }
          .summary { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px 16px; margin: 16px 0; border-radius: 4px; }
          .reconstructed { background: #fefce8; border-left: 4px solid #eab308; padding: 12px 16px; margin: 16px 0; border-radius: 4px; white-space: pre-wrap; }
          .correction { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; margin: 10px 0; }
          .correction .line-badge { background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
          .correction .original { color: #dc2626; text-decoration: line-through; }
          .correction .suggested { color: #16a34a; font-weight: 600; }
          .correction .explanation { display: block; color: #64748b; font-size: 13px; margin-top: 4px; }
          .alternative { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px; margin: 10px 0; }
          .alternative .line-badge { background: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Writing Coach Report</h1>
        
        ${corrections.reconstructed ? `
          <h2>Reconstructed Text (OCR Corrected)</h2>
          <div class="reconstructed">${corrections.reconstructed}</div>
        ` : ""}
        
        <h2>Overall Assessment</h2>
        <div class="summary">${corrections.summary}</div>
        
        ${corrections.corrections?.length > 0 ? `
          <h2>Grammar Corrections</h2>
          ${corrections.corrections.map(c => `
            <div class="correction">
              ${c.line ? `<span class="line-badge">Line ${c.line}</span>` : ""}
              <span class="original">${c.original}</span>
              &nbsp;&rarr;&nbsp;
              <span class="suggested">${c.suggested}</span>
              <span class="explanation">${c.explanation}</span>
            </div>
          `).join("")}
        ` : ""}
        
        ${corrections.alternatives?.length > 0 ? `
          <h2>Alternative Suggestions</h2>
          ${corrections.alternatives.map(a => `
            <div class="alternative">
              ${a.line ? `<span class="line-badge">Line ${a.line}</span>` : ""}
              <div>You wrote: "${a.original}"</div>
              <div><strong>Try:</strong> "${a.alternative}"</div>
              ${a.note ? `<div style="color:#64748b;font-size:13px;margin-top:4px;">${a.note}</div>` : ""}
            </div>
          `).join("")}
        ` : ""}
        
        <div class="footer">Generated by Writing Coach &bull; ${new Date().toLocaleDateString()}</div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // Reset everything
  const reset = () => {
    setFile(null);
    setPreview(null);
    setExtractedText("");
    setCorrections(null);
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div className="writing-coach">
      <h1>📝 Writing Coach</h1>
      <p className="subtitle">
        Upload your handwritten notes — get grammar corrections and writing suggestions from AI
      </p>

      {/* Upload Area */}
      {!file && (
        <div
          className={`upload-area ${dragover ? "dragover" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
          onDragLeave={() => setDragover(false)}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📄</div>
          <p>Drag & drop your notes here, or click to browse</p>
          <p className="formats">Supports: JPG, PNG, WebP, PDF</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div style={{ color: "#ef4444", marginTop: 10 }}>⚠️ {errorMsg}</div>
      )}

      {/* Main Layout: Preview + Results */}
      {file && (
        <div className="coach-layout">
          {/* Left: Preview + Extracted Text */}
          <div className="preview-section">
            <h3>📎 Uploaded Notes</h3>
            <div className="preview-box">
              {preview?.type === "image" && (
                <img src={preview.url} alt="Uploaded notes" />
              )}
              {preview?.type === "pdf" && (
                <div style={{ padding: 20, textAlign: "center" }}>
                  <span style={{ fontSize: 40 }}>📄</span>
                  <p>{preview.name}</p>
                </div>
              )}

              {extractedText && (
                <div className="extracted-text">
                  <strong>Extracted Text:</strong>
                  <br />
                  {extractedText.split("\n").map((line, i) => (
                    <div key={i} className="text-line">
                      <span className="line-number">{i + 1}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="actions-bar">
              {!extractedText && (
                <button
                  className="coach-btn primary"
                  onClick={extractText}
                  disabled={status === "ocr"}
                >
                  {status === "ocr" ? "Extracting..." : "🔍 Extract Text"}
                </button>
              )}

              {extractedText && !corrections && (
                <button
                  className="coach-btn primary"
                  onClick={analyzeGrammar}
                  disabled={status === "analyzing"}
                >
                  {status === "analyzing" ? "Analyzing..." : "🤖 Check Grammar"}
                </button>
              )}

              <button className="coach-btn secondary" onClick={reset}>
                🔄 Start Over
              </button>

              {corrections && (
                <button className="coach-btn primary" onClick={saveAsPDF}>
                  💾 Save as PDF
                </button>
              )}
            </div>
          </div>

          {/* Right: AI Results */}
          <div className="results-section">
            <h3>🤖 AI Feedback</h3>
            <div className="results-box">
              {status === "idle" && !corrections && (
                <div className="status-message">
                  <span>Extract text first, then click "Check Grammar" to get AI feedback.</span>
                </div>
              )}

              {(status === "ocr" || status === "analyzing") && (
                <div className="status-message">
                  <div className="spinner"></div>
                  <span>
                    {status === "ocr"
                      ? "Extracting text from your notes..."
                      : "AI is analyzing your writing..."}
                  </span>
                </div>
              )}

              {corrections && (
                <>
                  {/* Reconstructed text */}
                  {corrections.reconstructed && (
                    <div className="summary-box" style={{ background: "#fefce8", borderColor: "#fde047" }}>
                      <h3 style={{ color: "#854d0e" }}>📖 What you likely wrote (OCR corrected)</h3>
                      <p style={{ color: "#713f12", whiteSpace: "pre-wrap" }}>{corrections.reconstructed}</p>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="summary-box">
                    <h3>Overall Assessment</h3>
                    <p>{corrections.summary}</p>
                  </div>

                  {/* Corrections */}
                  {corrections.corrections?.length > 0 && (
                    <>
                      <h4>❌ Grammar Corrections</h4>
                      {corrections.corrections.map((c, i) => (
                        <div className="correction-item" key={i}>
                          {c.line && <span className="line-badge">Line {c.line}</span>}
                          <span className="original">{c.original}</span>
                          <span> → </span>
                          <span className="suggested">{c.suggested}</span>
                          <span className="explanation">{c.explanation}</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Alternatives */}
                  {corrections.alternatives?.length > 0 && (
                    <>
                      <h4>💡 Alternative Suggestions</h4>
                      {corrections.alternatives.map((a, i) => (
                        <div className="alternative-item" key={i}>
                          {a.line && <span className="line-badge alt">Line {a.line}</span>}
                          <div className="alt-label">You wrote: "{a.original}"</div>
                          <div className="alt-text">Try: "{a.alternative}"</div>
                          {a.note && (
                            <span className="explanation">{a.note}</span>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                  {corrections.corrections?.length === 0 &&
                    corrections.alternatives?.length === 0 && (
                      <p style={{ color: "#16a34a" }}>
                        ✅ Great job! No grammar issues found.
                      </p>
                    )}

                  {/* Raw response fallback */}
                  {corrections.rawResponse && (
                    <div style={{ marginTop: 12, padding: 12, background: "#f8fafc", borderRadius: 8, fontSize: 13, whiteSpace: "pre-wrap", color: "#475569" }}>
                      <strong>Raw AI Response:</strong><br />
                      {corrections.rawResponse}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
