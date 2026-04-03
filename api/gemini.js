import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting in memoria
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - record.start > 60000) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (record.count >= 5) return true;
  record.count++;
  rateLimitMap.set(ip, record);
  return false;
}

function validatePunteggi(punteggi) {
  if (!punteggi || typeof punteggi !== 'object') return false;
  if (Object.keys(punteggi).length !== 6) return false;
  return Object.values(punteggi).every(v => typeof v === 'number' && v >= -20 && v <= 20);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Troppe richieste. Riprova tra un minuto.' });
  }

  // Variabili d'ambiente — tutto server-side, nulla esposto al frontend
  const apiKey = process.env.GEMINI_API_KEY;
  const promptTemplate = process.env.GEMINI_PROMPT;

  if (!apiKey) return res.status(500).json({ error: 'Chiave API mancante.' });
  if (!promptTemplate) return res.status(500).json({ error: 'Prompt non configurato.' });

  const { punteggi } = req.body;

  if (!validatePunteggi(punteggi)) {
    return res.status(400).json({ error: 'Punteggi non validi.' });
  }

  try {
    // Costruisce il profilo testuale da inserire nel prompt
    const nomiGatti = {
      1: 'Paciock', 2: 'Peppa Pig', 3: 'Joey',
      4: 'Miss Marple', 5: 'Hannibal', 6: 'Duchessa'
    };

    const profiloUtente = Object.entries(punteggi)
      .map(([id, score]) => `${nomiGatti[id]}: ${score > 0 ? '+' : ''}${score}`)
      .join(', ');

    // Sostituisce il placeholder nel prompt con i punteggi reali
    // Nel prompt su Vercel usa {{PROFILO_UTENTE}} come segnaposto
    const promptFinale = promptTemplate.replace('{{PROFILO_UTENTE}}', profiloUtente);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: promptFinale }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200,
      },
    });

    const responseText = result.response.text();

    // Pulisce eventuali backtick markdown prima del parsing JSON
    const cleanJson = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const aiData = JSON.parse(cleanJson);

    // Validazione minima della risposta prima di restituirla
    if (!aiData.gatti || !Array.isArray(aiData.gatti)) {
      throw new Error('Formato risposta AI non valido');
    }

    return res.status(200).json(aiData);

  } catch (error) {
    console.error('Errore Gemini:', error.message);
    return res.status(500).json({ error: 'Errore generazione AI.' });
  }
}