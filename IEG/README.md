## Introvert / WhatsApp Auto‑Excuse Generator

A playful, one‑page web app that crafts quick, natural excuses tailored to your situation and relationship, and lets you send them via WhatsApp with one tap.

### Features
- **Expanded circumstances**: Believable, Weird but Works, Overly Dramatic, Running Late, Avoiding Events, Missing Deadlines, Personal Emergency, Health Issues, Travel Delays, Family Problems, Social Commitments
- **Scenario picker (19 options)**: traffic jam, urgent meeting, migraine, power outage, flight delay, etc.
- **Type of person**: Friend, Spouse, Boss, Parent, Sibling, Colleague, Teacher, Client, Cousin, etc.
- **Closeness level**: Very Close, Close, Acquaintance, Stranger (affects tone and formality)
- **Custom situation**: Free‑text to describe your specific context
- **AI‑generated excuse**: Uses OpenAI when available, with curated fallbacks if not
- **WhatsApp share**: Opens WhatsApp Web/mobile prefilled with your excuse
- **Responsive UI**: Minimal, pastel design with fun heading font

### Tech Stack
- **Frontend**: React 18, Tailwind CSS
- **Backend**: Node.js, Express
- **AI (optional)**: OpenAI API (fallbacks included)

### Quick Start
1) Install
```bash
npm install
```

2) Optional: enable AI
Create a `.env` file at the project root:
```env
OPENAI_API_KEY=sk-...your-key...
```
If omitted, the app automatically uses curated fallback excuses.

3) Run
```bash
npm start
```
- App: `http://localhost:3000`
- API health: `http://localhost:5000/api/health`
- Same Wi‑Fi on phone: `http://YOUR_PC_IP:3000`

### Usage
1) Pick a **Circumstance** (e.g., Running Late)
2) Optionally pick a **Scenario** (e.g., Traffic jam)
3) Choose **Relationship** (e.g., Boss)
4) Choose **Closeness level** (e.g., Acquaintance)
5) Optionally add **Custom situation** (your own words)
6) Click **Generate Excuse**
7) Click **Send via WhatsApp** to open a prefilled message

Excuses adapt tone and wording to the selected relationship and closeness (e.g., more formal for Boss/Stranger, warmer for Very Close).

### How It Works
- The client submits your selections to the API: `category`, `scenario`, `personType`, `closeness`, and optional `situation`.
- If `OPENAI_API_KEY` is set, the server generates a single, concise excuse (under ~220 chars) based on your inputs.
- If the AI call fails or no key is configured, the server composes a realistic excuse from curated templates and details; the client also has a fallback layer for resilience.
- Clicking WhatsApp uses: `https://wa.me/?text=` + `encodeURIComponent(excuse)`.

### API
- **POST** `/api/generate`
  - Request JSON:
    ```json
    {
      "category": "Running Late",
      "scenario": "traffic jam",
      "personType": "Boss",
      "closeness": "Acquaintance",
      "situation": "stuck on I-90 near exit 26"
    }
    ```
  - Response JSON:
    ```json
    {
      "excuse": "Quick heads‑up—caught in a traffic jam and running behind; I’ll update ETA shortly. Thank you for understanding.",
      "source": "ai" // or "fallback"
    }
    ```
- **GET** `/api/health` → `{ ok: true }`

### Development Scripts
- `npm start` — runs client and server together (ports 3000 and 5000)
- `npm run client` — start React dev server only
- `npm run server:dev` — start Express with nodemon
- `npm run build` — build production assets for the client

### Project Structure (high level)
- `public/` — HTML shell, fonts
- `src/` — React UI (`App.jsx`, `index.js`, `index.css`)
- `server/` — Express API (`index.js`)
- `tailwind.config.js` / `postcss.config.js` — Tailwind setup
- `package.json` — scripts and dependencies (proxy to API in dev)

### Deployment Notes
- Build the client: `npm run build`
- Serve the `build/` directory via your static host or a Node server
- Run the Express API separately (ensure it has `OPENAI_API_KEY` in its environment)
- In production, configure the client to call the deployed API base URL (remove CRA proxy or set a reverse proxy)

### Troubleshooting
- "Nothing shows" → Visit `http://localhost:3000` after `npm start`
- API not reachable → Check `http://localhost:5000/api/health`
- Port in use → Close other apps or change ports; set `PORT=5001` for server if needed
- No OpenAI key → The app still works with curated fallbacks
- Windows tip → To test health in PowerShell: `iwr -UseBasicParsing http://localhost:5000/api/health`

### Privacy
- No accounts or persistence. Inputs are used transiently to generate a one‑off message.

### License
- MIT (feel free to use and modify) 