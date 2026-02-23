# 🪄 SiteForge AI — AI-Powered Website Generator

> Generate stunning, production-ready websites from natural language descriptions using Groq + Llama 3.3 70B (100% Free - no credit card required).

---

## 📸 Features

| Feature | Description |
|---|---|
| **Natural Language Input** | Describe your website in plain English |
| **AI Layout Generation** | Llama 3.3 70B generates complete HTML/CSS/JS code |
| **Style + Color Controls** | 6 design styles × 6 color schemes |
| **Live Preview** | Instantly see your generated site in an iframe |
| **Refinement Chat** | Iterate on your design with follow-up prompts |
| **One-Click Export** | Download a ZIP with HTML, CSS, JS, and README |
| **Component Library** | Nav, hero, gallery, testimonials, forms, and more |
| **Fully Responsive** | All generated sites work on mobile, tablet, desktop |

---

## 🧠 Architecture

```
┌────────────────────────────────────────┐
│              React Frontend            │
│  • Prompt Input + Style Controls       │
│  • Live Preview (iframe + srcDoc)      │
│  • Code Viewer + ZIP Export            │
└──────────────┬─────────────────────────┘
               │ HTTP (fetch)
┌──────────────▼─────────────────────────┐
│          Express Backend (Node.js)     │
│  POST /api/generate  → Groq API        │
│  POST /api/refine    → Groq API        │
│  GET  /api/health                      │
└──────────────┬─────────────────────────┘
               │ Groq REST API
┌──────────────▼─────────────────────────┐
│    Llama 3.3 70B Versatile (LLM)       │
│  • Parses user prompt                  │
│  • Generates structured JSON           │
│    { html, css, js, title,             │
│      description, components[] }       │
└────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 | Component model, fast re-renders |
| Styling | Pure CSS with variables | No build overhead, full control |
| Backend | Express.js (Node) | Lightweight, fast API proxy |
| AI Model | Llama 3.3 70B via Groq | Free, fast, excellent code generation |
| HTTP Client | node-fetch | Lightweight REST API calls |
| Export | JSZip + FileSaver | Client-side ZIP creation, no server storage needed |

### Model Selection Rationale

**Llama 3.3 70B via Groq** was chosen for the following reasons:

1. **Free tier**: Groq offers 14,400 requests/day at no cost — no credit card required.
2. **Speed**: Groq's custom LPU hardware delivers extremely fast inference.
3. **Code quality**: Llama 3.3 70B generates clean, semantic HTML and modern CSS.
4. **Instruction following**: The structured JSON output format is reliably respected even for long outputs.
5. **Design sensibility**: Produces visually coherent layouts with thoughtful typography choices.

Alternative models considered:
- `GPT-4o` — excellent but requires paid OpenAI API access
- `Gemini 2.0 Flash` — free tier too restrictive (quota exceeded quickly)
- `Claude (Anthropic)` — superior quality but requires paid API access

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/ai-website-generator
cd ai-website-generator
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your Groq API key:
# GROQ_API_KEY=gsk_...
```

### 3. Run in Development

```bash
npm run dev
# React: http://localhost:3000
# API:   http://localhost:3001
```

### 4. Build for Production

```bash
npm run build
```

---

## 📡 API Reference

### `POST /api/generate`

Generate a new website from a prompt.

**Request Body:**
```json
{
  "prompt": "Portfolio website for a travel photographer",
  "style": "modern",
  "colorScheme": "blue"
}
```

**Response:**
```json
{
  "success": true,
  "website": {
    "html": "<!DOCTYPE html>...",
    "css": "/* styles */",
    "js": "// scripts",
    "fullHtml": "<!DOCTYPE html>... (complete document)",
    "title": "John Doe Photography",
    "description": "A modern portfolio for travel photography",
    "components": ["Navigation", "Hero", "Gallery", "Contact Form", "Footer"]
  }
}
```

### `POST /api/refine`

Refine an existing generated website.

**Request Body:**
```json
{
  "originalPrompt": "Portfolio website for a travel photographer",
  "refinement": "Add a dark hero background and make the gallery a masonry grid",
  "currentCode": { "html": "...", "css": "...", "js": "..." }
}
```

**Response:** Same structure as `/api/generate`

### `GET /api/health`

```json
{ "status": "ok", "model": "llama-3.3-70b-versatile", "provider": "Groq (Free)" }
```

---

## 🧩 Component Library

The AI selects from these components based on the website type:

| Component | Use Case |
|---|---|
| **Sticky Navigation** | All sites — responsive with hamburger menu |
| **Full-Screen Hero** | Landing pages, portfolios |
| **Split-Screen Hero** | SaaS, agencies |
| **Features Grid** | SaaS, product pages |
| **Portfolio Gallery** | Photography, design, creative |
| **Testimonials Carousel** | Agencies, e-commerce |
| **Pricing Cards** | SaaS, services |
| **Contact Form** | All sites |
| **Team Section** | Agencies, startups |
| **FAQ Accordion** | Products, services |
| **Statistics Counter** | Agencies, corporates |
| **Newsletter Signup** | Blogs, content sites |
| **Footer** | All sites |

---

## 🌐 Deployment

### Vercel (Frontend)
```bash
npm run build
vercel --prod
```

### Render (Backend)
1. Create new Web Service on [render.com](https://render.com)
2. Set root directory, build command: `npm install`
3. Start command: `node server/index.js`
4. Add `GROQ_API_KEY` environment variable

### Environment Variables (Production)
```
GROQ_API_KEY=gsk_...
PORT=3001
```

---

## 📁 Project Structure

```
ai-website-generator/
├── public/
│   └── index.html              # HTML shell
├── server/
│   └── index.js                # Express API server
├── src/
│   ├── App.jsx                 # Main React component
│   ├── App.css                 # All styles
│   └── index.js                # Entry point
├── .env.example                # Environment template
├── .gitignore
├── package.json
└── README.md
```

---

## 🔒 Security Notes

- API key is stored server-side only, never exposed to the browser
- The preview iframe uses `sandbox="allow-scripts allow-same-origin"` to contain generated code
- All user input is passed directly to the AI model; no SQL or shell injection risk

---

## 📄 License

MIT © 2024