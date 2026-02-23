// server/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── Groq API Helper ───────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(systemPrompt, userMessage) {
  const fetch = (await import("node-fetch")).default;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 8192,
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content || "";
}

// ─── System Prompt ──────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert web developer and designer. Your job is to generate complete, beautiful, production-ready websites based on user descriptions.

When generating a website:
1. Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "html": "<complete HTML content for the body>",
  "css": "/* complete CSS styles */",
  "js": "// complete JavaScript code (can be empty string if not needed)",
  "title": "Page Title",
  "description": "Brief description of what was generated",
  "components": ["list", "of", "components", "used"]
}

2. Design requirements:
- Create visually stunning, modern designs
- Use CSS variables for theming
- Ensure fully responsive design (mobile, tablet, desktop)
- Add smooth animations and hover effects
- Use Google Fonts (via @import in CSS) for beautiful typography
- Include a navigation bar (sticky), hero section, main content, and footer
- Generate realistic placeholder content relevant to the user's request
- Use a cohesive color palette with CSS custom properties

3. Code quality:
- Write semantic HTML5
- Use CSS Grid and Flexbox for layouts
- Include CSS transitions and keyframe animations
- Make JS code vanilla (no external dependencies unless CDN-linked in HTML)
- Add proper meta tags in HTML head
- Ensure accessibility (alt tags, aria labels, proper heading hierarchy)

4. Component library to choose from based on context:
- Navigation (sticky, transparent-on-scroll, hamburger mobile menu)
- Hero (full-screen, split-screen, minimal)
- Features/Services grid
- Portfolio/Gallery grid with lightbox
- Testimonials carousel
- Pricing cards
- Contact form with validation
- Team section
- FAQ accordion
- Statistics counter
- Newsletter signup
- Footer with social links

Always generate complete, working code. The HTML should be a full document including <!DOCTYPE html> and all head/body tags.`;

// ─── Shared JSON parser helper ───────────────────────────────────
function parseWebsiteJson(rawContent) {
  const jsonMatch =
    rawContent.match(/```json\n?([\s\S]*?)\n?```/) ||
    rawContent.match(/```\n?([\s\S]*?)\n?```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : rawContent;
  const websiteData = JSON.parse(jsonStr);

  if (!websiteData.html.includes("<!DOCTYPE")) {
    websiteData.fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${websiteData.title}</title>
  <style>${websiteData.css}</style>
</head>
<body>
${websiteData.html}
<script>${websiteData.js}</script>
</body>
</html>`;
  } else {
    websiteData.fullHtml = websiteData.html;
  }

  return websiteData;
}

// ─── Generate Website Endpoint ──────────────────────────────────
app.post("/api/generate", async (req, res) => {
  const { prompt, style, colorScheme } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const userMessage = `Create a website for the following: "${prompt}"
${style ? `Design style preference: ${style}` : ""}
${colorScheme ? `Color scheme preference: ${colorScheme}` : ""}

Generate a complete, stunning website. Return ONLY the JSON object.`;

    const rawContent = await callGroq(SYSTEM_PROMPT, userMessage);
    const websiteData = parseWebsiteJson(rawContent);

    res.json({ success: true, website: websiteData });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate website",
      details: error.message,
    });
  }
});

// ─── Refine Website Endpoint ─────────────────────────────────────
app.post("/api/refine", async (req, res) => {
  const { originalPrompt, refinement, currentCode } = req.body;

  try {
    const userMessage = `Original website request: "${originalPrompt}"
Current code: ${JSON.stringify(currentCode)}
Refinement request: "${refinement}"
Apply the refinement and return the complete updated JSON object.`;

    const rawContent = await callGroq(SYSTEM_PROMPT, userMessage);
    const websiteData = parseWebsiteJson(rawContent);

    res.json({ success: true, website: websiteData });
  } catch (error) {
    console.error("Refinement error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to refine website",
      details: error.message,
    });
  }
});

// ─── Health Check ────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: GROQ_MODEL, provider: "Groq (Free)" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
