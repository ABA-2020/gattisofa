import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting in memoria (si azzera ad ogni cold start di Vercel)
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
  if (Object.keys(punteggi).length !== 5) return false;
  return Object.values(punteggi).every(v => typeof v === 'number' && v >= -20 && v <= 20);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting per IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Troppe richieste. Riprova tra un minuto.' });
  }

  // API key solo server-side
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Chiave API mancante.' });
  console.log('API Key presente:', !!apiKey);

  const { punteggi } = req.body;
  if (!validatePunteggi(punteggi)) {
    return res.status(400).json({ error: 'Punteggi non validi.' });
  }

  try {
    // Specifichiamo esplicitamente la versione stabile dell'API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel(
    { model: "gemini-pro" },
    { apiVersion: 'v1' } // Aggiungi questa riga
    );

    const prompt = `
Sei il motore di profilazione psicologica di un test basato su cinema e serie TV.
L'utente ha ottenuto dei punteggi (da -20 a +20) per 5 "profili felini".

=== REGOLE DI INGAGGIO PER I PUNTEGGI ===
- Punteggio ALTO (da +8 a +20): Il gatto è entusiasta. Sente l'utente affine e consiglia caldamente 2-3 serie TV del suo genere, spiegando brevemente perché si adattano al profilo.
- Punteggio NEUTRO (da -7 a +7): Il gatto è tiepido/indifferente. Fa un'osservazione neutra e suggerisce 1 serie del suo genere con tono leggero.
- Punteggio BASSO (da -8 a -20): Il gatto è offeso o sarcastico. Critica bonariamente i gusti dell'utente, sconsiglia le sue atmosfere e propone ironicamente 1 titolo "di riscatto".

REGOLA TASSATIVA: Non menzionare mai Reality Show, Talent Show, programmi di cucina o competizioni televisive.

=== DATABASE DEI 5 GATTI ===

1. PINK PANTHER — Il tipo ironico (Commedia & Dramedy)
Personalità: Calmo, brillante, autoironico. Trova nel ritmo comico il suo habitat naturale. Non si prende mai troppo sul serio.
Generi: Light comedy, Sitcom, Dramedy, Satira, Mockumentary.
Titoli base: Call My Agent, Fleabag, The Office, Ted Lasso, Emily in Paris, Unorthodox, Government Cheese.
Tono del messaggio: spiritoso, leggero, mai pesante. Usa humor sottile.

2. ELIZABETH — Il tipo raffinato (Pure Drama)
Personalità: Regale, introspettiva, dalle emozioni profonde. Vive di relazioni complesse e potere silenzioso. Niente sparatorie, niente action.
Generi: Drama autoriale, Corporate drama, Storico-politico, Familiare, Medico, Legale.
Titoli base: Mad Men, The Young Pope, Succession, White Lotus, The Crown, House of Cards, 1883, I leoni di Sicilia, Il Gattopardo, Downton Abbey, Big Little Lies, The Morning Show, La Regina degli Scacchi, The Leftovers.
Tono del messaggio: misurato, sofisticato, leggermente altero. Sa di essere superiore.

3. INDIANA — Il tipo audace (Action & Crime)
Personalità: Istintivo, leale, sempre in movimento. Ama il crimine violento, l'adrenalina pura, i personaggi duri. Niente misteri da risolvere intellettualmente.
Generi: Action puro, Crime violento, Gangster, Mafia, Spy story, War.
Titoli base: Breaking Bad, Peaky Blinders, Gomorra, Narcos, Le Bureau, Night Manager, Fauda, Killing Eve, Fargo, Ozark, Homeland, I Soprano, 24, Landman, Your Honor, Slow Horses, La Casa de Papel, Babylon Berlin, Squid Game, Trono di Spade, Last of Us, Westworld, The Walking Dead.
Tono del messaggio: diretto, energico, un po' sbruffone. Parla come un duro.

4. SHERLOCK — Il tipo acuto (Thriller & Giallo investigativo)
Personalità: Metodico, infallibile, leggermente superiore. Non si ferma finché il mistero non è risolto. La verità è tutto.
Generi: Thriller, Thriller psicologico, Giallo investigativo, Procedural, Survival, Horror puro.
Titoli base: Mindhunter, True Detective, Wallander, Colombo, The Mentalist, Dexter, Lidia Poët, Sherlock Holmes, The Bridge, Poirot, Bosch, Goliath, Monk, The Sinner.
Tono del messaggio: preciso, analitico, con un sottile senso di superiorità intellettuale. Come se stesse risolvendo anche l'utente.

5. HERMIONE — Il tipo sognatore (Teen, Fantasy, Sci-Fi, Animazione)
Personalità: Curiosa, appassionata, a suo agio in mondi reali o fantastici. Ama le storie di formazione, i protagonisti giovani, le avventure epiche e i mondi immaginari.
Generi: Teen drama, Young Adult, Romance, Fantasy (High e Dark), Fantascienza, Animazione (tutte le tipologie).
Titoli base: Stranger Things, Harry Potter (serie), Game of Thrones, House of the Dragon, The Rings of Power, Arcane, Dune (serie), The Witcher, Wednesday, Heartstopper, Sex Education, Euphoria, Avatar: The Last Airbender, Your Name, Attack on Titan.
Tono del messaggio: entusiasta, sognante, appassionato. Si emoziona facilmente.

=== PUNTEGGI DELL'UTENTE ===
${JSON.stringify(punteggi)}
Chiavi: 1=Pink Panther, 2=Elizabeth, 3=Indiana, 4=Sherlock, 5=Hermione

=== COMPITO ===
Scrivi un messaggio per OGNI gatto IN PRIMA PERSONA, iniziando sempre con "Miao umano..." o varianti creative.
Ogni gatto deve:
1. Reagire al punteggio rispettando fedelmente la propria personalità e il proprio tono
2. Menzionare almeno 1 titolo dalla sua lista base in modo naturale
3. Consigliare (o sconsigliare con ironia) 1-2 serie TV nuove con la stessa vibe
4. Mantenere il messaggio tra 60 e 120 parole — né troppo breve né troppo lungo

RISPONDI ESCLUSIVAMENTE CON UN OGGETTO JSON VALIDO.
Nessun testo fuori dal JSON. Nessun blocco markdown (\`\`\`json). Solo JSON puro.

{
  "intro": "Breve commento psicologico generale di 2 righe su come l'utente si posiziona tra i mondi seriali...",
  "gatti": [
    { "id": "1", "nome": "Pink Panther", "messaggio": "Miao umano... [testo in prima persona]" },
    { "id": "2", "nome": "Elizabeth",    "messaggio": "Miao umano... [testo in prima persona]" },
    { "id": "3", "nome": "Indiana",      "messaggio": "Miao umano... [testo in prima persona]" },
    { "id": "4", "nome": "Sherlock",     "messaggio": "Miao umano... [testo in prima persona]" },
    { "id": "5", "nome": "Hermione",     "messaggio": "Miao umano... [testo in prima persona]" }
  ]
}`;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 1800,
      },
    });

const responseText = result.response.text();

    // 1. Trova l'inizio e la fine del JSON ignorando tutto il resto
    const startJson = responseText.indexOf('{');
    const endJson = responseText.lastIndexOf('}');

    if (startJson === -1 || endJson === -1) {
      console.error("L'AI non ha restituito un JSON:", responseText);
      throw new Error('Formato risposta AI non valido: JSON non trovato');
    }

    // 2. Estrae solo la stringa racchiusa tra le graffe
    const cleanJson = responseText.substring(startJson, endJson + 1);
    
    try {
      const aiData = JSON.parse(cleanJson);

      // 3. Validazione struttura risposta
      if (!aiData.gatti || !Array.isArray(aiData.gatti) || aiData.gatti.length !== 5) {
        throw new Error('La struttura dei gatti nel JSON è incompleta');
      }

      return res.status(200).json(aiData);
    } catch (parseError) {
      console.error("Errore nel parsing del JSON pulito:", cleanJson);
      throw new Error('Errore durante la lettura dei dati generati dall\'AI');
    }

  } catch (error) {
    console.error('Errore Gemini:', error.message);
    return res.status(500).json({ error: 'Errore generazione AI.' });
  }
}