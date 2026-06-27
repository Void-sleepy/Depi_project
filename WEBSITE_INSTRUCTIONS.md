# RAG Assistant — Website Build Instructions v2
> Complete spec for the website. Two pages: a landing page and a chat UI. Feed this entire file to AI before writing any code.

---

## What You're Building

Two pages for a RAG assistant aimed at NLP/AI developers:

1. **`/` — Landing page**: Sells the product. Fast, confident, visually impressive. Makes someone want to click "Start asking."
2. **`/chat` — Chat UI**: The actual tool. Perplexity-level polish. Sources shown as cards, code blocks with copy buttons, smooth streaming.

The LLM backend is handled separately — this guide covers only the website. The FastAPI service exposes `POST /query` and `GET /health`. Do not build anything related to ML, Qdrant, or embeddings here.

---

## Architecture

```
Browser
  │
  ├── GET /          → Flask renders landing.html
  ├── GET /chat      → Flask renders chat.html
  │
  └── JS fetch() ──▶ FastAPI (port 8000)
                        POST /query   → { answer, sources, latency_ms }
                        GET  /health  → { status, qdrant, llm }
```

Flask serves pages. FastAPI handles all intelligence. They share nothing.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Web server | Flask 3.0 |
| Reactivity | Alpine.js 3.x (CDN) |
| Styling | Custom CSS only — no Tailwind |
| Icons | Lucide icons (CDN, SVG sprite) |
| Markdown | marked.js 12.x (CDN) |
| Syntax highlighting | highlight.js 11.x (CDN, Python + Bash only) |
| Fonts | Google Fonts |
| API calls | Native `fetch()` |

> No Tailwind this time. The design is specific enough that custom CSS will look far better and more intentional than utility classes.

---

## File Structure

```
rag-assistant/
├── .venv/
├── requirements.txt
├── .env
│
├── website/
│   ├── app.py
│   ├── templates/
│   │   ├── landing.html
│   │   └── chat.html
│   └── static/
│       ├── css/
│       │   ├── tokens.css       # CSS custom properties only
│       │   ├── landing.css      # Landing page styles
│       │   └── chat.css         # Chat UI styles
│       └── js/
│           ├── landing.js       # Landing page interactions
│           └── chat.js          # Alpine.js chat component
│
└── api/
    └── main.py
```

---

## Design System

### Direction

Think **Perplexity AI meets Linear**. Dark, structured, information-dense but never cluttered. The kind of UI that makes a developer trust the tool before they've typed anything. Every spacing decision is intentional, every color has a reason.

This is NOT:
- ❌ A SaaS marketing page with gradients everywhere
- ❌ A GPT wrapper with grey bubbles on white
- ❌ Glassmorphism cards floating on dark blur
- ❌ The typical AI chatbot look (dark sidebar + white chat area)

This IS:
- ✅ A serious developer tool with visual confidence
- ✅ Dark throughout, layered depth, not flat
- ✅ One accent color, used with restraint
- ✅ Generous whitespace, tight typography
- ✅ Animations that serve function, not decoration

---

### `static/css/tokens.css` — full file

```css
:root {
  /* ── Backgrounds ── */
  --bg-0:           #08090f;   /* page base — deepest layer */
  --bg-1:           #0f1018;   /* sidebar, panels */
  --bg-2:           #181923;   /* cards, elevated surfaces */
  --bg-3:           #21222e;   /* hover, active states */
  --bg-input:       #13141d;   /* input fields */
  --bg-code:        #0d0e16;   /* code blocks */

  /* ── Borders ── */
  --border-subtle:  #1e1f2e;   /* dividers, quiet separators */
  --border-default: #272840;   /* card outlines, input borders */
  --border-focus:   #5b6af5;   /* focused inputs */

  /* ── Accent ── */
  --accent:         #5b6af5;   /* primary interactive color */
  --accent-hover:   #7580f7;
  --accent-soft:    rgba(91, 106, 245, 0.15);
  --accent-glow:    rgba(91, 106, 245, 0.25);

  /* ── Text ── */
  --text-1:         #eef0fa;   /* headings, primary content */
  --text-2:         #9499b5;   /* body, secondary labels */
  --text-3:         #585d78;   /* placeholders, disabled, timestamps */
  --text-code:      #b8c0e0;   /* text inside code blocks */

  /* ── Functional ── */
  --green:          #34d399;   /* online status, success */
  --red:            #f87171;   /* error, offline */
  --yellow:         #fbbf24;   /* warning, degraded */

  /* ── Typography ── */
  --font-sans:      'Inter', system-ui, sans-serif;
  --font-display:   'Sora', sans-serif;
  --font-mono:      'JetBrains Mono', monospace;

  /* ── Type scale ── */
  --text-xs:        0.72rem;
  --text-sm:        0.85rem;
  --text-base:      1rem;
  --text-lg:        1.15rem;
  --text-xl:        1.4rem;
  --text-2xl:       1.9rem;
  --text-3xl:       2.8rem;
  --text-4xl:       4rem;

  /* ── Spacing ── */
  --space-1:        4px;
  --space-2:        8px;
  --space-3:        12px;
  --space-4:        16px;
  --space-5:        24px;
  --space-6:        32px;
  --space-7:        48px;
  --space-8:        64px;

  /* ── Radius ── */
  --r-sm:           6px;
  --r-md:           10px;
  --r-lg:           16px;
  --r-xl:           24px;
  --r-pill:         999px;

  /* ── Shadows ── */
  --shadow-sm:      0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:      0 4px 16px rgba(0,0,0,0.5);
  --shadow-accent:  0 0 24px var(--accent-glow);
}
```

### Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Role | Font | Where |
|---|---|---|
| Display | `Sora` 700 | Landing hero, page titles |
| UI | `Inter` 400/500/600 | All labels, buttons, body text |
| Code | `JetBrains Mono` | Code blocks in chat responses |

---

## Page 1 — Landing (`/`)

### What it needs to do

One job: make the developer want to click "Start asking." It should answer three questions in 5 seconds: What is this? Why does it matter? How do I start?

### Layout (top to bottom)

```
┌────────────────────────────────────────────────────────┐
│  NAV: logo left · "Open chat →" button right           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  HERO                                                  │
│  ─────────────────────────────────────                 │
│  Eyebrow: "For NLP & AI developers"                    │
│                                                        │
│  Ask your docs.          ← Sora 700, 4rem              │
│  Get answers.            ← same, accent color on       │
│                             "answers"                  │
│                                                        │
│  One sentence value prop below ← Inter 500, text-2     │
│                                                        │
│  [ Start asking → ]  ← accent filled button            │
│                                                        │
│  Terminal preview window ← shows a fake chat exchange  │
│                                                        │
├────────────────────────────────────────────────────────┤
│  FEATURES (3 cards, horizontal row)                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Icon         │ │ Icon         │ │ Icon         │   │
│  │ Title        │ │ Title        │ │ Title        │   │
│  │ Description  │ │ Description  │ │ Description  │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
├────────────────────────────────────────────────────────┤
│  SOURCES SECTION                                       │
│  "Trained on documentation from:"                      │
│  Logo chips: LangChain · HuggingFace · ChromaDB        │
├────────────────────────────────────────────────────────┤
│  FOOTER: copyright · GitHub link                       │
└────────────────────────────────────────────────────────┘
```

### Hero terminal preview

This is the landing page's signature element. A fake terminal window (CSS only, no JS needed) showing a sample exchange:

```
┌─────────────────────────────────────────────────────┐
│  ● ● ●                              DevDocs AI  ×   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  You  ──────────────────────────────────────────    │
│  How do I add memory to a LangChain agent?          │
│                                                     │
│  Assistant  ────────────────────────────────────    │
│  To add memory to a LangChain agent, use the        │
│  ConversationBufferMemory class and pass it to      │
│  the AgentExecutor...                               │
│                                                     │
│  ▸ 3 sources · 640ms                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Style: `background: var(--bg-1)`, `border: 1px solid var(--border-default)`, `border-radius: var(--r-lg)`, subtle `box-shadow: var(--shadow-md)`. The three dots (●●●) are colored red/yellow/green. Use a CSS typing animation on the assistant response text — it types itself out on page load using `@keyframes` and `steps()`, loops once.

### Feature cards (3 items)

| Icon | Title | Description |
|---|---|---|
| `<search>` | Source-grounded answers | Every response is backed by real documentation. No hallucinations. |
| `<code>` | Code-aware retrieval | Understands code blocks, function signatures, and API references. |
| `<zap>` | Fast by design | Hybrid vector search returns the right context in under 200ms. |

Card style: `background: var(--bg-1)`, `border: 1px solid var(--border-subtle)`, hover lifts to `var(--bg-2)` with border brightening to `var(--border-default)`. Transition 180ms. Icon uses accent color.

### CSS for landing (`static/css/landing.css`)

- Nav: `position: fixed`, `top: 0`, `width: 100%`, `backdrop-filter: blur(12px)`, `background: rgba(8,9,15,0.8)`, `border-bottom: 1px solid var(--border-subtle)`, `z-index: 100`. Logo uses `Sora` font. CTA button: `border: 1px solid var(--border-default)`, transparent bg, hover fills with `var(--accent-soft)`.
- Hero: `min-height: 100vh`, `display: flex`, `flex-direction: column`, `justify-content: center`, `align-items: center`, `text-align: center`. Subtle radial gradient behind the headline: `radial-gradient(ellipse 60% 40% at 50% 40%, rgba(91,106,245,0.08) 0%, transparent 70%)` — feels like a soft glow behind the text, not a gradient blob.
- Features grid: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: var(--space-5)`, `max-width: 960px`, `margin: 0 auto`.
- Source chips: pill-shaped tags, `border: 1px solid var(--border-default)`, `border-radius: var(--r-pill)`, `padding: 6px 14px`, `font-size: var(--text-sm)`.
- On mobile (< 768px): features grid goes to 1 column, hero headline drops to `2.2rem`, terminal preview hidden.

### JS for landing (`static/js/landing.js`)

Minimal. Two things only:
1. Scroll-triggered fade-in on feature cards: `IntersectionObserver`, add class `visible` when card enters viewport, CSS does `opacity: 0 → 1`, `translateY(16px) → 0`, 300ms ease.
2. Smooth scroll for any anchor links.

---

## Page 2 — Chat UI (`/chat`)

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│ SIDEBAR (260px)       │ MAIN AREA                            │
│                       │                                      │
│ [+ New chat]          │  ┌─── EMPTY STATE ───────────────┐  │
│                       │  │                               │  │
│ ── Today ──           │  │   DevDocs AI                  │  │
│  • Chat title 1       │  │   Ask anything about your     │  │
│  • Chat title 2       │  │   AI documentation.           │  │
│                       │  │                               │  │
│ ── Yesterday ──       │  │  ┌─────┐ ┌─────┐ ┌─────┐    │  │
│  • Chat title 3       │  │  │ sug │ │ sug │ │ sug │    │  │
│                       │  │  └─────┘ └─────┘ └─────┘    │  │
│                       │  └───────────────────────────────┘  │
│                       │                                      │
│ ── bottom ──          │  ┌─── INPUT BAR ─────────────────┐  │
│  ● API connected      │  │  [ Ask about LangChain... ] ▶ │  │
└───────────────────────┴──────────────────────────────────────┘
```

When chat has messages, the empty state disappears and messages fill the area above the input bar.

### Message anatomy

**User message:**
```
                    ┌────────────────────────────────┐
                    │ How do I create a RAG chain?   │
                    └────────────────────────────────┘
                                              [timestamp]
```
Right-aligned. Background `var(--accent-soft)`, border `1px solid var(--border-default)`, border-radius `var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)`. Max-width 68%.

**Assistant message:**
```
  ┌─────────────────────────────────────────────────────┐
  │ A RAG chain combines a retriever and a generator.   │
  │ Here's the basic setup:                             │
  │                                                     │
  │  ┌─── python ──────────────────── [copy] ────────┐  │
  │  │  chain = RetrievalQA.from_chain_type(...)      │  │
  │  └───────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────────┐
  │  Sources                                            │
  │  ┌─────────────────────┐  ┌─────────────────────┐  │
  │  │ 📄 retrieval.md     │  │ 📄 chains/base.md   │  │
  │  │ "A retriever is..." │  │ "Chain types..."    │  │
  │  └─────────────────────┘  └─────────────────────┘  │
  └─────────────────────────────────────────────────────┘
  [answered in 842ms]
```

Left-aligned. Background `var(--bg-2)`, border `1px solid var(--border-subtle)`. Sources appear BELOW the message bubble as separate cards, not inside it. Each source card: filename bold, 1-line excerpt in `var(--text-3)`, monospace filename font.

### Code blocks inside messages

- Header bar: language name left, copy button right — `background: var(--bg-code)`, `border-bottom: 1px solid var(--border-subtle)`
- Code area: `JetBrains Mono`, `font-size: var(--text-sm)`, `overflow-x: auto`
- Copy button: copies to clipboard, switches icon to checkmark for 2s, then resets
- highlight.js handles syntax coloring — use the `atom-one-dark` theme from CDN

### Typing indicator

Three dots, staggered bounce. Each dot is 6px, `background: var(--text-3)`. Animation: vertical bounce with 0ms / 150ms / 300ms delays, 600ms duration, infinite. Show only while `isLoading` is true.

### Input bar

Pinned to bottom. Full-width. `background: var(--bg-0)`, `padding: var(--space-4) var(--space-5)`, `border-top: 1px solid var(--border-subtle)`.

Inner input wrapper: `background: var(--bg-input)`, `border: 1px solid var(--border-default)`, `border-radius: var(--r-xl)`, `padding: 14px 20px`. On focus: border becomes `var(--border-focus)`, `box-shadow: 0 0 0 3px var(--accent-soft)`.

Textarea: auto-grows up to 6 lines. Send button: 40px circle, `background: var(--accent)`, disabled opacity 0.35. Keyboard: `Ctrl+Enter` or `Cmd+Enter` sends.

Below input bar: small hint text `var(--text-3)` — "Ctrl+Enter to send · answers are grounded in documentation"

### Sidebar CSS details

- `width: 260px`, `min-height: 100vh`, `background: var(--bg-1)`, `border-right: 1px solid var(--border-subtle)`
- "New chat" button: full width, `border: 1px solid var(--border-default)`, `border-radius: var(--r-md)`, hover `background: var(--bg-3)`, `+` icon left
- History items: `padding: 8px 12px`, `border-radius: var(--r-md)`, hover `background: var(--bg-2)`, active has left accent bar `border-left: 2px solid var(--accent)`
- Section labels ("Today", "Yesterday"): `font-size: var(--text-xs)`, `color: var(--text-3)`, `text-transform: uppercase`, `letter-spacing: 0.08em`, `padding: 12px 12px 4px`
- Status indicator at bottom: 8px dot (green/red/yellow), label text `var(--text-3)`, `font-size: var(--text-sm)`
- On mobile: sidebar is off-canvas, slides in from left with a hamburger toggle button

### Empty state (center of chat area when no messages)

```
DevDocs AI          ← Sora 700, var(--text-2xl)
Tagline text        ← Inter 400, var(--text-2), max-width 400px, centered

Suggestion chips (3):
[ How do I create a custom LangChain tool? ]
[ What is a HuggingFace pipeline?          ]
[ How does ChromaDB handle metadata?       ]
```

Chips: `border: 1px solid var(--border-default)`, `border-radius: var(--r-md)`, `padding: 10px 16px`, `font-size: var(--text-sm)`, hover `background: var(--bg-2)`, clicking populates and sends the input.

---

## `chat.js` — Alpine.js Component

```javascript
function chatApp() {
  return {
    messages: [],
    sessions: [],
    currentSessionId: null,
    inputText: "",
    isLoading: false,
    sidebarOpen: true,
    apiStatus: "checking",

    init() {
      this.loadSessions();
      this.checkApi();
      setInterval(() => this.checkApi(), 30000);
      this.autoGrowTextarea();
    },

    async checkApi() {
      try {
        const r = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(3000) });
        const d = await r.json();
        this.apiStatus = d.status === "ok" ? "online" : "degraded";
      } catch {
        this.apiStatus = "offline";
      }
    },

    async sendMessage() {
      const q = this.inputText.trim();
      if (!q || this.isLoading) return;
      this.inputText = "";
      this.isLoading = true;
      this.addMessage("user", q, []);
      const aid = this.addMessage("assistant", "", []);

      try {
        const res = await fetch(`${API_URL}/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q })
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        await this.streamIn(aid, data.answer, data.sources, data.latency_ms);
        this.saveSession();
      } catch (e) {
        this.updateMessage(aid, `Error: ${e.message}`, []);
      } finally {
        this.isLoading = false;
        this.$nextTick(() => this.scrollBottom());
      }
    },

    async streamIn(id, text, sources, latency) {
      const words = text.split(" ");
      let out = "";
      for (const w of words) {
        out += (out ? " " : "") + w;
        this.updateMessage(id, out + " ▋", sources, null);
        await new Promise(r => setTimeout(r, 25));
      }
      this.updateMessage(id, text, sources, latency);
      this.$nextTick(() => {
        document.querySelectorAll("pre code").forEach(el => hljs.highlightElement(el));
      });
    },

    addMessage(role, content, sources, latency = null) {
      const id = crypto.randomUUID();
      this.messages.push({ id, role, content, html: this.render(content), sources, latency, showSources: true });
      this.$nextTick(() => this.scrollBottom());
      return id;
    },

    updateMessage(id, content, sources, latency) {
      const m = this.messages.find(m => m.id === id);
      if (!m) return;
      m.content = content;
      m.html = this.render(content);
      if (sources?.length) m.sources = sources;
      if (latency !== undefined) m.latency = latency;
    },

    render(text) {
      if (!text) return "";
      return marked.parse(text);
    },

    scrollBottom() {
      const el = this.$refs.messages;
      if (el) el.scrollTop = el.scrollHeight;
    },

    sendSuggestion(text) {
      this.inputText = text;
      this.$nextTick(() => this.sendMessage());
    },

    newChat() {
      this.messages = [];
      this.currentSessionId = null;
    },

    loadSessions() {
      try { this.sessions = JSON.parse(localStorage.getItem("devdocs_sessions") || "[]"); }
      catch { this.sessions = []; }
    },

    saveSession() {
      if (!this.messages.length) return;
      const id = this.currentSessionId || Date.now();
      const title = this.messages[0].content.slice(0, 40) + "…";
      const session = { id, title, messages: this.messages, ts: Date.now() };
      this.currentSessionId = id;
      const i = this.sessions.findIndex(s => s.id === id);
      if (i >= 0) this.sessions[i] = session; else this.sessions.unshift(session);
      this.sessions = this.sessions.slice(0, 30);
      localStorage.setItem("devdocs_sessions", JSON.stringify(this.sessions));
    },

    loadSession(id) {
      const s = this.sessions.find(s => s.id === id);
      if (!s) return;
      this.messages = s.messages;
      this.currentSessionId = id;
    },

    autoGrowTextarea() {
      // called from @input on the textarea in HTML
    },

    grow(el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    },

    get groupedSessions() {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const groups = { Today: [], Yesterday: [], Older: [] };
      for (const s of this.sessions) {
        const d = new Date(s.ts).toDateString();
        if (d === today) groups.Today.push(s);
        else if (d === yesterday) groups.Yesterday.push(s);
        else groups.Older.push(s);
      }
      return groups;
    }
  };
}
```

---

## Flask `app.py`

```python
from flask import Flask, render_template
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__, template_folder="templates", static_folder="static")

API_URL = os.getenv("FASTAPI_URL", "http://localhost:8000")

@app.route("/")
def landing():
    return render_template("landing.html")

@app.route("/chat")
def chat():
    return render_template("chat.html", api_url=API_URL)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
```

---

## CDN Imports (use these exact URLs)

```html
<!-- Alpine.js -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>

<!-- marked.js -->
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>

<!-- highlight.js core + atom-one-dark theme + languages -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/json.min.js"></script>

<!-- Lucide icons -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>lucide.createIcons();</script>
```

For Lucide icons in HTML, use: `<i data-lucide="search"></i>` and let the script replace them with SVGs.

---

## Performance Rules

- All `<script>` tags at bottom of `<body>` or with `defer`
- `<link rel="preconnect">` for Google Fonts before the font `<link>`
- No images — all visuals are CSS and SVG icons
- `@media (prefers-reduced-motion: reduce)` block disables all transitions and animations
- Textarea auto-grow: 3-line JS, no library
- localStorage reads only in `init()`, never in render loops

---

## `.env`

```env
FASTAPI_URL=http://localhost:8000
FLASK_ENV=development
FLASK_DEBUG=1
```

---

## Build Order for AI

Tell the AI to build in this exact order and stop after each file for your review:

1. `static/css/tokens.css` — design tokens only, no component styles
2. `static/css/landing.css` — landing page styles
3. `templates/landing.html` — full landing page
4. `static/js/landing.js` — scroll animations only
5. `static/css/chat.css` — full chat UI styles
6. `templates/chat.html` — full chat template
7. `static/js/chat.js` — Alpine component
8. `app.py` — Flask routes

---

## Session Prompt for AI

> "I'm building a two-page website for a RAG assistant. Here are the complete build instructions: [paste this file]. We are starting with [FILE NAME]. Build only that file. Use the exact CSS tokens defined in tokens.css — never invent new hex values. Follow the layout specs and component anatomy exactly. Stop after this file and wait for my feedback."
