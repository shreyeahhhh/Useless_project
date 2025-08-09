import React, { useState } from 'react';

const categories = [
  { value: 'Believable', label: '✅ Believable' },
  { value: 'Weird but Works', label: '🤪 Weird but Works' },
  { value: 'Overly Dramatic', label: '🎭 Overly Dramatic' },
  { value: 'Running Late', label: '⏰ Running Late' },
  { value: 'Avoiding Events', label: '🙈 Avoiding Events' },
  { value: 'Missing Deadlines', label: '📅 Missing Deadlines' },
  { value: 'Personal Emergency', label: '🚨 Personal Emergency' },
  { value: 'Health Issues', label: '🤒 Health Issues' },
  { value: 'Travel Delays', label: '✈️ Travel Delays' },
  { value: 'Family Problems', label: '👪 Family Problems' },
  { value: 'Social Commitments', label: '🤝 Social Commitments' },
];

const scenarios = [
  { value: '', label: 'Not specified' },
  { value: 'traffic jam', label: 'Traffic jam' },
  { value: 'car trouble', label: 'Car trouble' },
  { value: 'bus/train delay', label: 'Bus/Train delay' },
  { value: 'urgent meeting', label: 'Urgent meeting' },
  { value: 'unexpected work call', label: 'Unexpected work call' },
  { value: 'childcare issue', label: 'Childcare issue' },
  { value: 'pet emergency', label: 'Pet emergency' },
  { value: 'family emergency', label: 'Family emergency' },
  { value: 'migraine', label: 'Migraine' },
  { value: 'food poisoning', label: 'Food poisoning' },
  { value: 'doctor appointment overran', label: 'Doctor appointment overran' },
  { value: 'internet outage', label: 'Internet outage' },
  { value: 'power outage', label: 'Power outage' },
  { value: 'home repair emergency', label: 'Home repair emergency' },
  { value: 'flat tire', label: 'Flat tire' },
  { value: 'bad weather', label: 'Bad weather' },
  { value: 'stuck at the bank', label: 'Stuck at the bank' },
  { value: 'flight delay', label: 'Flight delay' },
];

const personTypes = [
  'Friend',
  'Spouse',
  'Boss',
  'Parent',
  'Sibling',
  'Colleague',
  'Cousin',
  'Teacher',
  'Client',
];

const closenessLevels = ['Very Close', 'Close', 'Acquaintance', 'Stranger'];

// Client-side fallback mirrors server logic (trimmed set)
const defaultDetailsByCategory = {
  'Running Late': ['traffic snarls', 'unexpected road work'],
  'Avoiding Events': ['a prior commitment', 'a low social battery day'],
  'Missing Deadlines': ['an unexpected blocker', 'a system issue'],
  'Personal Emergency': ['a personal situation', 'an urgent matter at home'],
  'Health Issues': ['a migraine', 'not feeling well'],
  'Travel Delays': ['a delayed train', 'airport delays'],
  'Family Problems': ['a family situation', 'a caregiver duty'],
  'Social Commitments': ['a promise to a friend', 'a family gathering'],
  'Believable': ['a home repair visit', 'a Wi‑Fi outage'],
  'Weird but Works': ['a rogue lasagna in the oven', 'goldfish tutoring time'],
  'Overly Dramatic': ['fainting social stamina', 'moody lunar decree'],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function softenings(closeness) {
  if (closeness === 'Very Close') return ['I’m really sorry', 'My bad', 'Honestly,'];
  if (closeness === 'Close') return ['I’m sorry', 'Sorry about this', 'Hey—quick heads‑up'];
  if (closeness === 'Acquaintance') return ['Sorry about this', 'Apologies', 'Quick heads‑up'];
  return ['Apologies', 'Regretfully', 'I apologize'];
}

function signoffs(closeness, personType) {
  if (['Boss', 'Teacher', 'Client'].includes(personType) || closeness === 'Stranger') {
    return ['Thank you for understanding.', 'Appreciate your understanding.', 'Thank you for your patience.'];
  }
  if (closeness === 'Acquaintance') return ['Thanks for understanding.', 'Appreciate it.', 'Thank you.'];
  return ['Thanks for understanding!', 'I owe you one!', 'Appreciate it!'];
}

const fallbackTemplates = {
  'Running Late': [
    "{soft}—I’m running a bit behind due to {detail}. I’ll keep you posted and make up the time. {sign}",
    "{soft}. {detail} slowed me down, but I’m on my way. {sign}",
  ],
  'Avoiding Events': [
    "{soft}. Today’s not my best social day—{detail}. I’ll have to skip. {sign}",
    "{soft}. A last‑minute {detail} popped up, so I can’t make it. {sign}",
  ],
  'Missing Deadlines': [
    "{soft}. I hit {detail} and won’t meet the deadline. I’ll deliver the next best version ASAP. {sign}",
    "{soft}. I’m behind due to {detail}. New ETA coming shortly. {sign}",
  ],
  'Personal Emergency': [
    "{soft}. I have a personal situation to handle ({detail}). I need to step away. {sign}",
    "{soft}. Something urgent came up at home—{detail}. I’ll follow up soon. {sign}",
  ],
  'Health Issues': [
    "{soft}. I’m under the weather ({detail}) and should rest. I’ll regroup soon. {sign}",
    "{soft}. Not feeling well—{detail}. I’ll catch up as soon as I can. {sign}",
  ],
  'Travel Delays': [
    "{soft}. Travel is delayed due to {detail}. I’ll update timing once I have it. {sign}",
    "{soft}. Caught in {detail} and running late. I’ll keep you posted. {sign}",
  ],
  'Family Problems': [
    "{soft}. I need to handle a family matter ({detail}) and step away for a bit. {sign}",
    "{soft}. A family situation came up—{detail}. I’ll reconnect soon. {sign}",
  ],
  'Social Commitments': [
    "{soft}. I promised to be at a prior commitment ({detail}) and can’t make it. {sign}",
    "{soft}. I’m tied up with {detail}. Let’s reschedule. {sign}",
  ],
  'Believable': [
    "{soft}. A quick {detail} just came up, so I’ll have to bow out. {sign}",
    "{soft}. Dealing with {detail}. Rain check? {sign}",
  ],
  'Weird but Works': [
    "{soft}. Long story short—{detail}. I know, weird, but I’m out for now. {sign}",
    "{soft}. It’s a whole thing with {detail}. Catch you later. {sign}",
  ],
  'Overly Dramatic': [
    "{soft}. Fate conspires and {detail} has claimed the evening. I must retreat. {sign}",
    "{soft}. My social stamina collapses under {detail}. I shall return renewed. {sign}",
  ],
};

function resolveDetail(category, situation, scenario) {
  if (scenario && scenario.trim()) return scenario.trim();
  if (situation && situation.trim()) return situation.trim();
  const defaults = defaultDetailsByCategory[category] || ['an unexpected issue'];
  return pick(defaults);
}

function randomClientFallback(category, personType, closeness, situation, scenario) {
  const cat = categories.find(c => c.value === category)?.value || 'Believable';
  const tpl = pick(fallbackTemplates[cat]);
  const soft = pick(softenings(closeness));
  const sign = pick(signoffs(closeness, personType));
  const detail = resolveDetail(cat, situation, scenario);
  return tpl.replace('{soft}', soft).replace('{sign}', sign).replace('{detail}', detail);
}

function App() {
  const [category, setCategory] = useState(categories[0].value);
  const [scenario, setScenario] = useState(scenarios[0].value);
  const [personType, setPersonType] = useState(personTypes[0]);
  const [closeness, setCloseness] = useState(closenessLevels[1]);
  const [situation, setSituation] = useState('');

  const [excuse, setExcuse] = useState('');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const generateExcuse = async () => {
    setLoading(true);
    setNote('');
    setExcuse('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, scenario, personType, closeness, situation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to generate');
      setExcuse(data.excuse || randomClientFallback(category, personType, closeness, situation, scenario));
    } catch (e) {
      setNote('Using a curated fallback while the AI naps.');
      setExcuse(randomClientFallback(category, personType, closeness, situation, scenario));
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsApp = () => {
    if (!excuse) return;
    const url = 'https://wa.me/?text=' + encodeURIComponent(excuse);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 drop-shadow-sm font-fredoka">
            Need an excuse? We got you!
          </h1>
          <p className="mt-2 text-slate-600">Introvert Excuse Generator</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 sm:p-8 border border-white/60">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Circumstance</label>
              <select
                className="w-full rounded-xl border-slate-300 focus:border-purple-400 focus:ring-purple-300 bg-white/90"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Scenario (optional)</label>
              <select
                className="w-full rounded-xl border-slate-300 focus:border-purple-400 focus:ring-purple-300 bg-white/90"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
              >
                {scenarios.map((s) => (
                  <option key={s.value || 'none'} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Relationship</label>
              <select
                className="w-full rounded-xl border-slate-300 focus:border-purple-400 focus:ring-purple-300 bg-white/90"
                value={personType}
                onChange={(e) => setPersonType(e.target.value)}
              >
                {personTypes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Closeness Level</label>
              <select
                className="w-full rounded-xl border-slate-300 focus:border-purple-400 focus:ring-purple-300 bg-white/90"
                value={closeness}
                onChange={(e) => setCloseness(e.target.value)}
              >
                {closenessLevels.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Custom Situation (optional)</label>
              <textarea
                rows={3}
                className="w-full rounded-xl border-slate-300 focus:border-purple-400 focus:ring-purple-300 bg-white/90"
                placeholder="e.g., stuck in traffic on the expressway, sudden migraine, childcare issue, laptop crashed, etc."
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
              />
            </div>

            <div className="col-span-1 sm:col-span-2 flex">
              <button
                onClick={generateExcuse}
                disabled={loading}
                className="h-12 w-full rounded-xl bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-semibold shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating…' : 'Generate Excuse'}
              </button>
            </div>
          </div>

          {note && (
            <div className="mt-4 text-sm text-purple-700">{note}</div>
          )}

          {excuse && (
            <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-white to-violet-50 border border-violet-200">
              <div className="text-slate-800 text-lg">{excuse}</div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={sendWhatsApp}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 hover:bg-green-600 text-white px-4 py-2 shadow"
                  aria-label="Send via WhatsApp"
                >
                  <span>Send via WhatsApp</span>
                </button>
                <button
                  onClick={() => setExcuse('')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-slate-500 text-sm">
          <span role="img" aria-label="sparkles">✨</span> Works on desktop and mobile. No login needed—WhatsApp opens with your excuse ready.
        </div>
      </div>
    </div>
  );
}

export default App; 