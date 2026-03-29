export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { punteggi, risposte, likert } = req.body;

  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  const TOKEN = process.env.VITE_TOKEN;

  if (!GOOGLE_SCRIPT_URL) {
    return res.status(500).json({ error: 'Configurazione mancante' });
  }

  // Invio principale (punteggi + risposte)
  if (punteggi && risposte) {
    if (Object.keys(punteggi).length !== 6) {
      return res.status(400).json({ error: 'Dati non validi' });
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

  // Invio likert (separato, dopo che l'utente compila i risultati)
  if (likert) {
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