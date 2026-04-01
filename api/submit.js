// Rate limiting semplice in memoria (si azzera ad ogni cold start)
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minuto
  const maxRequests = 10;     // max 10 invii per minuto per IP

  const record = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - record.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }

  if (record.count >= maxRequests) return true;

  record.count++;
  rateLimitMap.set(ip, record);
  return false;
}

function validateRisposte(risposte) {
  if (!risposte || typeof risposte !== 'object') return false;
  const eta = Number(risposte.D2);
  if (risposte.D2 !== undefined && (isNaN(eta) || eta < 1 || eta > 120)) return false;
  const sessiAmmessi = ['Uomo', 'Donna', 'Altro', ''];
  if (risposte.D1 !== undefined && !sessiAmmessi.includes(risposte.D1)) return false;
  return true;
}

function validatePunteggi(punteggi) {
  if (!punteggi || typeof punteggi !== 'object') return false;
  if (Object.keys(punteggi).length !== 6) return false;
  return Object.values(punteggi).every(v => typeof v === 'number' && v >= -20 && v <= 20);
}

function validateLikert(likert) {
  if (!likert || typeof likert !== 'object') return false;
  return Object.values(likert).every(v => v === null || (Number.isInteger(v) && v >= 1 && v <= 5));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting per IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Troppe richieste, riprova tra un minuto' });
  }

  // Token e URL solo lato server — mai esposti al frontend
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  const TOKEN = process.env.TOKEN; // ⚠️ rinominata da VITE_TOKEN a TOKEN in Vercel env vars

  if (!GOOGLE_SCRIPT_URL || !TOKEN) {
    return res.status(500).json({ error: 'Configurazione mancante' });
  }

  const { punteggi, risposte, likert } = req.body;

  // ── Invio test (punteggi + risposte) ──────────────────────────────
  if (punteggi && risposte) {
    if (!validatePunteggi(punteggi)) {
      return res.status(400).json({ error: 'Punteggi non validi' });
    }
    if (!validateRisposte(risposte)) {
      return res.status(400).json({ error: 'Risposte non valide' });
    }
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: TOKEN,
          tipo: 'test',
          punteggi_raw: punteggi,
          risposte_mappate: risposte,
        }),
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Errore invio test' });
    }
  }

  // ── Invio likert ───────────────────────────────────────────────────
  if (likert) {
    if (!validateLikert(likert)) {
      return res.status(400).json({ error: 'Valori likert non validi' });
    }
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: TOKEN,
          tipo: 'likert',
          likert_gatti: likert,
        }),
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Errore invio likert' });
    }
  }

  return res.status(400).json({ error: 'Dati mancanti' });
}