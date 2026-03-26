export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { punteggi, risposte } = req.body;

  if (!punteggi || !risposte) {
    return res.status(400).json({ error: 'Dati mancanti' });
  }
  if (Object.keys(punteggi).length !== 6) {
    return res.status(400).json({ error: 'Dati non validi' });
  }

  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  const TOKEN = process.env.VITE_TOKEN;

  if (!GOOGLE_SCRIPT_URL) {
    return res.status(500).json({ error: 'Configurazione mancante' });
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: TOKEN,           // ← aggiunto
        punteggi_raw: punteggi, // ← rinominato
        risposte_mappate: risposte, // ← rinominato
      }),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore invio' });
  }
}