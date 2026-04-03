// api/admin-data.js
// Legge i dati direttamente dal Google Sheet tramite Google Apps Script


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  // 1. Verifica password admin
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return res.status(401).json({ error: 'Password errata o non configurata' });
  }

  // 2. Legge i dati dal Google Script (stesso endpoint di submit.js)
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  const TOKEN = process.env.TOKEN;

  if (!GOOGLE_SCRIPT_URL || !TOKEN) {
    return res.status(500).json({ error: 'Configurazione mancante' });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: TOKEN,
        tipo: 'leggi_dati', // nuovo tipo — da aggiungere in app_script
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Script error: ${response.status}`);
    }

    const text = await response.text();

    // Il Google Script restituirà JSON con i dati
    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (error) {
    console.error('Errore lettura dati:', error);
    return res.status(500).json({ error: 'Impossibile leggere i dati.' });
  }
}