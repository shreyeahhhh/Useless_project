<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7"/>


# Introvert Excuse Generator 🎯
Need an excuse?- we got you!

## Basic Details
### Team Name: Shreya's Team -INDIVIDUAL

### Project Description
A playful one-page web app that generates natural, context‑aware excuses you can send with one tap via WhatsApp. Choose a circumstance and scenario, select the recipient type and closeness, and optionally add your own situation to tailor the tone and wording. Powered by React + Tailwind and a Node/Express API with OpenAI support and curated fallbacks for reliable results on desktop and mobile.

### The Problem (that doesn't exist)
People often need to send quick, polite, and context-appropriate excuses (e.g., for being late, avoiding events, or missing deadlines) but struggle to draft them under time pressure. This project provides a one-page, mobile-friendly web app that generates natural excuses tailored to circumstance, recipient type, relationship closeness, and an optional custom situation, and lets users send them via WhatsApp instantly. The app must keep messages realistic and non-offensive, support both AI-based generation and curated fallbacks, and work reliably across desktop and mobile without requiring login.

### The Solution (that nobody asked for)
Build a one-page React + Tailwind app with fields for circumstance, scenario, relationship, closeness, and an optional custom situation, then display a concise excuse with a “Send via WhatsApp” link. Power generation via a Node/Express API that uses OpenAI when available and tone-aware curated fallbacks otherwise (adjusted by person type and closeness). Keep the UI responsive, minimal, and mobile-friendly.

## Technical Details
### Technologies/Components Used
For Software:
Frontend: React 18 (Create React App with react-scripts), Tailwind CSS, PostCSS + Autoprefixer, Google Fonts; minor use of React Icons/Framer Motion available.
Backend: Node.js + Express, CORS, dotenv, OpenAI Node SDK (model: gpt-4o-mini), Nodemon for dev.
Dev/Build: concurrently (runs client + server), CRA proxy; WhatsApp integration via https://wa.me/?text=.

### Implementation
For Software:
Frontend (React + Tailwind)
State: category, scenario, personType, closeness, situation, excuse, loading.
UI: four selectors + textarea above a single “Generate Excuse” button; card shows the result with “Send via WhatsApp”.
Logic: fetch('/api/generate', { category, scenario, personType, closeness, situation }); on failure, build a client-side fallback using tone rules and templates; WhatsApp: window.open('https://wa.me/?text=' + encodeURIComponent(excuse)).
Responsive: Tailwind grid (sm:grid-cols-2), large tap targets, pastel gradients, fun font.
Backend (Node + Express)
Routes:
POST /api/generate: validates inputs, computes tone via toneGuidance(personType, closeness), resolves detail (scenario > situation > defaults), calls OpenAI if OPENAI_API_KEY exists; otherwise returns curated fallback from templates with softenings and signoffs.
GET /api/health: returns { ok: true }.
Fallback engine: category→template bank + tone-aware phrases; relationship and closeness alter formality and sign‑offs.
Env: .env with OPENAI_API_KEY; CORS enabled; runs on PORT (default 5000).
Data
Request: { category, scenario, personType, closeness, situation }.
Response: { excuse: string, source: 'ai'|'fallback' }.
Run
npm install
Optional .env with OPENAI_API_KEY=...
npm start (client: 3000, server: 5000; proxy configured)
Quality
Error handling with graceful fallbacks; short, natural, non‑offensive messages (< ~220 chars); no login or persistence.

# Installation
[commands]

# Run
[commands]

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Screenshot1]

https://drive.google.com/file/d/1HnlIOp20ujsu8k_FbVzys9-I9UNjct-M/view?usp=sharing
*Add caption explaining what this shows*

![Screenshot2](Add screenshot 2 here with proper name)
https://drive.google.com/file/d/1Co-G1RrVuIeaeFtCedKMPMmiE3fW5nVo/view?usp=sharing
*Add caption explaining what this shows*

![Screenshot3](Add screenshot 3 here with proper name)
https://drive.google.com/file/d/1H8biCWooQyUfXhArt1t_6tOpNCnbNYFM/view?usp=sharing
*Add caption explaining what this shows*


### Project Demo
# Video
https://drive.google.com/file/d/1vpAnhE2chE9BXvrgV0aAXjeEzIvbvPN8/view?usp=sharing


---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)



