const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Expanded categories and fallback templates
const categories = [
  'Believable',
  'Weird but Works',
  'Overly Dramatic',
  'Running Late',
  'Avoiding Events',
  'Missing Deadlines',
  'Personal Emergency',
  'Health Issues',
  'Travel Delays',
  'Family Problems',
  'Social Commitments',
];

const defaultDetailsByCategory = {
  'Running Late': ['traffic snarls', 'unexpected road work', 'a delayed rideshare'],
  'Avoiding Events': ['a prior commitment', 'a sudden schedule clash', 'a low social battery day'],
  'Missing Deadlines': ['an unexpected blocker', 'a system issue', 'a workload spike'],
  'Personal Emergency': ['a personal situation', 'an urgent matter at home', 'an unforeseen issue'],
  'Health Issues': ['a migraine', 'a sudden fever', 'not feeling well'],
  'Travel Delays': ['a delayed train', 'a missed connection', 'airport delays'],
  'Family Problems': ['a family situation', 'a caregiver duty', 'an urgent family call'],
  'Social Commitments': ['a prior promise to a friend', 'a family gathering', 'a community commitment'],
  'Believable': ['a home repair visit', 'a Wi‑Fi outage', 'a scheduling mix‑up'],
  'Weird but Works': ['a rogue lasagna in the oven', 'a mime omen in my horoscope', 'goldfish tutoring time'],
  'Overly Dramatic': ['fainting social stamina', 'moody lunar decree', 'a tragic supernova of small talk'],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function toneGuidance(closeness, personType) {
  const veryClose = 'very warm, honest, slightly casual';
  
  const closeTone = 'warm, honest, slightly casual';
  const acquaintance = 'polite, light, concise';
  const stranger = 'formal, respectful, concise';
  const map = { 'Very Close': veryClose, 'Close': closeTone, 'Acquaintance': acquaintance, 'Stranger': stranger };
  const base = map[closeness] || acquaintance;

  const personHints = {
    Boss: 'avoid slang, focus on accountability and next steps',
    Teacher: 'respectful and accountable, avoid humor',
    Client: 'professional, solution‑oriented, offer follow‑up',
    Colleague: 'professional but friendly; suggest follow‑up',
    Spouse: 'empathetic and considerate',
    Parent: 'courteous and reassuring',
    Friend: 'friendly, light humor ok',
    Sibling: 'casual with mild humor',
    Cousin: 'casual but polite',
  };
  const hint = personHints[personType] || 'natural and considerate';
  return `${base}; ${hint}`;
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
    "{soft}, {person}. {detail} slowed me down, but I’m on my way. {sign}",
  ],
  'Avoiding Events': [
    "{soft}, {person}. Today’s not my best social day—{detail}. I’ll have to skip. {sign}",
    "{soft}. A last‑minute {detail} popped up, so I can’t make it. {sign}",
  ],
  'Missing Deadlines': [
    "{soft}. I hit {detail} and won’t meet the deadline. I’ll deliver the next best version ASAP. {sign}",
    "{soft}, {person}. I’m behind due to {detail}. New ETA coming shortly. {sign}",
  ],
  'Personal Emergency': [
    "{soft}. I have a personal situation to handle ({detail}). I need to step away. {sign}",
    "{soft}, {person}. Something urgent came up at home—{detail}. I’ll follow up soon. {sign}",
  ],
  'Health Issues': [
    "{soft}. I’m under the weather ({detail}) and should rest. I’ll regroup soon. {sign}",
    "{soft}, {person}. Not feeling well—{detail}. I’ll catch up as soon as I can. {sign}",
  ],
  'Travel Delays': [
    "{soft}. Travel is delayed due to {detail}. I’ll update timing once I have it. {sign}",
    "{soft}, {person}. Caught in {detail} and running late. I’ll keep you posted. {sign}",
  ],
  'Family Problems': [
    "{soft}. I need to handle a family matter ({detail}) and step away for a bit. {sign}",
    "{soft}, {person}. A family situation came up—{detail}. I’ll reconnect soon. {sign}",
  ],
  'Social Commitments': [
    "{soft}. I promised to be at a prior commitment ({detail}) and can’t make it. {sign}",
    "{soft}, {person}. I’m tied up with {detail}. Let’s reschedule. {sign}",
  ],
  'Believable': [
    "{soft}. A quick {detail} just came up, so I’ll have to bow out. {sign}",
    "{soft}, {person}. Dealing with {detail}. Rain check? {sign}",
  ],
  'Weird but Works': [
    "{soft}. Long story short—{detail}. I know, weird, but I’m out for now. {sign}",
    "{soft}, {person}. It’s a whole thing with {detail}. Catch you later. {sign}",
  ],
  'Overly Dramatic': [
    "{soft}. Fate conspires and {detail} has claimed the evening. I must retreat. {sign}",
    "{soft}, {person}. My social stamina collapses under {detail}. I shall return renewed. {sign}",
  ],
};

function displayPerson(personType, closeness) {
  if (['Boss', 'Teacher', 'Client'].includes(personType) || closeness === 'Stranger') return '—';
  return '';
}

function resolveDetail(category, situation, scenario) {
  if (scenario && String(scenario).trim().length > 0) return String(scenario).trim();
  if (situation && String(situation).trim().length > 0) return String(situation).trim();
  const defaults = defaultDetailsByCategory[category] || ['an unexpected issue'];
  return pick(defaults);
}

function generateFallbackExcuse(category, personType, closeness, situation, scenario) {
  const cat = categories.includes(category) ? category : 'Believable';
  const tpl = pick(fallbackTemplates[cat]);
  const soft = pick(softenings(closeness));
  const sign = pick(signoffs(closeness, personType));
  const detail = resolveDetail(cat, situation, scenario);
  const person = displayPerson(personType, closeness);
  return tpl
    .replace('{soft}', soft)
    .replace('{sign}', sign)
    .replace('{detail}', detail)
    .replace('{person}', person);
}

app.post('/api/generate', async (req, res) => {
  const { category, scenario = '', personType = 'Friend', closeness = 'Acquaintance', situation = '' } = req.body || {};
  const selectedCategory = categories.includes(category) ? category : 'Believable';

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.json({
        excuse: generateFallbackExcuse(selectedCategory, personType, closeness, situation, scenario),
        source: 'fallback',
      });
    }

    const { OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey });

    const tone = toneGuidance(closeness, personType);
    const detail = resolveDetail(selectedCategory, situation, scenario);

    const prompt = `Compose ONE short, natural, polite excuse (under 220 characters) combining these:
- Category: ${selectedCategory}
- Person: ${personType}
- Closeness: ${closeness} (tone: ${tone})
- Scenario: ${scenario || 'n/a'}
- Situation: ${situation || detail}
Guidelines: realistic for WhatsApp, non-offensive, no names, no emojis or hashtags, first-person singular, one sentence.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You craft brief, context-aware excuses for messaging. Keep it under 220 characters. Avoid emojis and hashtags.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 120,
    });

    const excuse = completion?.choices?.[0]?.message?.content?.trim();
    if (!excuse) {
      return res.json({
        excuse: generateFallbackExcuse(selectedCategory, personType, closeness, situation, scenario),
        source: 'fallback',
      });
    }

    res.json({ excuse, source: 'ai' });
  } catch (err) {
    console.error('AI generation failed:', err?.message || err);
    return res.json({
      excuse: generateFallbackExcuse(category, personType, closeness, situation, scenario),
      source: 'fallback',
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
}); 