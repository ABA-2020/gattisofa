import React, { useState, useEffect, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import './App.css'; 

import PaciockImg from './assets/gatti/Paciock.svg';
import PeppaPigImg from './assets/gatti/Peppa_pig.svg';
import JoeyImg from './assets/gatti/Joey.svg';
import MissMarpleImg from './assets/gatti/Miss_Marple.svg';
import HannibalImg from './assets/gatti/Hannibal.svg';
import LuluImg from './assets/gatti/lulu.svg'; 
// Se hai l'immagine di copertina (quella con la scritta SERIE TV LIBRI POP), importala qui:
import CoverImg from './assets/banner.jpg'; 

const catProfiles = {
  1: { name: "Paciock", image: PaciockImg, profile: "Il pigro: calmo, abitudinario, rilassato. Ama il comfort.", genre: "Comedy / Sitcom" },
  2: { name: "Peppa Pig", image: PeppaPigImg, profile: "La chiacchierona: empatica, legata alla famiglia e alle tradizioni.", genre: "Family Drama / Storico" },
  3: { name: "Joey", image: JoeyImg, profile: "L'amicone: leale, socievole, ama l'avventura e il gruppo.", genre: "Pop / Cult / Fantasy" },
  4: { name: "Miss Marple", image: MissMarpleImg, profile: "L'investigatrice: curiosa, analitica, cerebrale, instancabile.", genre: "Crime / Mystery / Politico" },
  5: { name: "Hannibal", image: HannibalImg, profile: "Il killer: misterioso, dark, ama l'estetica estrema e il brivido.", genre: "Horror / Thriller / Sci-Fi" },
  6: { name: "Lulù", image: LuluImg, profile: "La sognatrice: emotiva, romantica, vive di grandi passioni.", genre: "Teen / Romance / Young Adult" }
};

// --- MISCHIATORE ARRAY ---
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ==========================================
// DATASET DOMANDE (75 totali)
// ==========================================
const demographicQuestions = [
  { id: "D1", type: "demo", title: "Qual è il tuo sesso?", leftOption: "Uomo", upOption: "Altro / Preferisco non dirlo", rightOption: "Donna" },
  { id: "D2", type: "demo", title: "In quale fascia d'età rientri?", leftOption: "Sotto i 25", upOption: "25 - 45 anni", rightOption: "Oltre i 45" },
];

const catValidationQuestions = [
  { id: "C1", type: "cat", title: "Ti piacerebbe avere a casa Paciock (Pigro e affettuoso)?", leftOption: "No, troppo noioso", upOption: "Neutro", rightOption: "Sì, lo amo!" },
  { id: "C2", type: "cat", title: "Vorresti vivere con Peppa Pig (Empatica e chiacchierona)?", leftOption: "No, troppa ansia", upOption: "Neutro", rightOption: "Sì, adorabile" },
  { id: "C3", type: "cat", title: "Joey (L'amicone fedele) sarebbe il gatto perfetto per te?", leftOption: "Non credo", upOption: "Neutro", rightOption: "Assolutamente sì" },
  { id: "C4", type: "cat", title: "Adotteresti Miss Marple (L'investigatrice curiosa)?", leftOption: "No, fa troppi guai", upOption: "Neutro", rightOption: "Sì, mi affascina" },
  { id: "C5", type: "cat", title: "Terresti in casa Hannibal (Il felino dark e misterioso)?", leftOption: "No, mi fa paura", upOption: "Neutro", rightOption: "Sì, è intrigante" },
  { id: "C6", type: "cat", title: "Lulù (La sognatrice dolce ed emotiva) farebbe al caso tuo?", leftOption: "No, troppo sdolcinata", upOption: "Neutro", rightOption: "Sì, è dolcissima" },
];

const tvQuestions = [
  // PACIOCK
  { id: "T1", type: "tv", title: "Cosa ne pensi di 'The Office'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T2", type: "tv", title: "Cosa ne pensi di 'Friends'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T3", type: "tv", title: "Cosa ne pensi di 'Boris'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T4", type: "tv", title: "Cosa ne pensi di 'Scrubs'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T5", type: "tv", title: "Cosa ne pensi di 'Ted Lasso'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  // PEPPA PIG
  { id: "T6", type: "tv", title: "Cosa ne pensi di 'This Is Us'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T7", type: "tv", title: "Cosa ne pensi di 'Normal People'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T8", type: "tv", title: "Cosa ne pensi di 'The Crown'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T9", type: "tv", title: "Cosa ne pensi di 'Scenes from a Marriage'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T10", type: "tv", title: "Cosa ne pensi di 'Mad Men'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  // JOEY
  { id: "T11", type: "tv", title: "Cosa ne pensi di 'Game of Thrones'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T12", type: "tv", title: "Cosa ne pensi di 'Lost'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T13", type: "tv", title: "Cosa ne pensi di 'The Boys'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T14", type: "tv", title: "Cosa ne pensi di 'Vikings'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T15", type: "tv", title: "Cosa ne pensi di 'Arcane'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  // MISS MARPLE
  { id: "T16", type: "tv", title: "Cosa ne pensi di 'True Detective'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T17", type: "tv", title: "Cosa ne pensi di 'Mindhunter'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T18", type: "tv", title: "Cosa ne pensi di 'House of Cards'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T19", type: "tv", title: "Cosa ne pensi di 'Succession'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T20", type: "tv", title: "Cosa ne pensi di 'Fargo'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  // HANNIBAL
  { id: "T21", type: "tv", title: "Cosa ne pensi di 'Breaking Bad'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T22", type: "tv", title: "Cosa ne pensi di 'The Sopranos'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T23", type: "tv", title: "Cosa ne pensi di 'Dark'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T24", type: "tv", title: "Cosa ne pensi di 'Black Mirror'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T25", type: "tv", title: "Cosa ne pensi di 'Mr. Robot'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  // LULÙ
  { id: "T26", type: "tv", title: "Cosa ne pensi di 'Euphoria'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T27", type: "tv", title: "Cosa ne pensi di 'Elite'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T28", type: "tv", title: "Cosa ne pensi di 'Dawson’s Creek'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T29", type: "tv", title: "Cosa ne pensi di 'Skins (UK)'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T30", type: "tv", title: "Cosa ne pensi di 'Beverly Hills 90210'?", leftOption: "Non mi piace", upOption: "Mai vista", rightOption: "La amo" },
];

const psychQuestions = [
  { id: "P1", type: "psych", title: "Preferisci un viaggio in un posto...", leftOption: "Nuovo", leftProfiles: [1, 2, 6], upOption: "Indifferente", rightOption: "Già visitato", rightProfiles: [3, 4, 5] },
  { id: "P2", type: "psych", title: "Preferisci andare a cena...", leftOption: "Gente nuova", leftProfiles: [1, 2, 6], upOption: "Indifferente", rightOption: "Vecchi amici", rightProfiles: [3, 4, 5] },
  { id: "P3", type: "psych", title: "Preferiresti un lavoro...", leftOption: "Stabile", leftProfiles: [3, 4, 5], upOption: "Indifferente", rightOption: "Fantasioso", rightProfiles: [1, 2, 6] },
  { id: "P4", type: "psych", title: "Preferisci un amico...", leftOption: "Simpatico", leftProfiles: [1, 3], upOption: "Indifferente", rightOption: "Che ti capisca", rightProfiles: [2, 4, 6] },
  { id: "P5", type: "psych", title: "Gettarti da uno scoglio alto è...", leftOption: "Da evitare", leftProfiles: [1, 2, 6], upOption: "Indifferente", rightOption: "Eccitante", rightProfiles: [3, 4, 5] },
  { id: "P6", type: "psych", title: "Preferisci quadri di...", leftOption: "Arte astratta", leftProfiles: [4, 5], upOption: "Indifferente", rightOption: "Ritratti", rightProfiles: [1, 2, 3, 6] },
  { id: "P7", type: "psych", title: "Preferisci quadri...", leftOption: "Impressionisti", leftProfiles: [1, 2, 3, 6], upOption: "Indifferente", rightOption: "Cubismo", rightProfiles: [4, 5] },
  { id: "P8", type: "psych", title: "Preferisci musica...", leftOption: "Lirica", leftProfiles: [1, 2, 3, 6], upOption: "Indifferente", rightOption: "Jazz", rightProfiles: [4, 5] },
  { id: "P9", type: "psych", title: "Saresti campione di...", leftOption: "Discesa libera", leftProfiles: [3, 5], upOption: "Indifferente", rightOption: "Pallavolo", rightProfiles: [1, 2, 4, 6] },
  { id: "P10", type: "psych", title: "Saresti campione di...", leftOption: "Tennis", leftProfiles: [4, 5], upOption: "Indifferente", rightOption: "Pallavolo", rightProfiles: [2, 3, 6] },
  { id: "P11", type: "psych", title: "Preferisci giocare a...", leftOption: "Burraco", leftProfiles: [1, 2, 3, 6], upOption: "Indifferente", rightOption: "Scacchi", rightProfiles: [4, 5] },
  { id: "P12", type: "psych", title: "Preferisci...", leftOption: "L'amore", leftProfiles: [2, 3, 6], upOption: "Indifferente", rightOption: "Il successo", rightProfiles: [4, 5] },
  { id: "P13", type: "psych", title: "Preferisci studiare...", leftOption: "Filosofia", leftProfiles: [2, 3, 6], upOption: "Indifferente", rightOption: "Matematica", rightProfiles: [4, 5] },
  { id: "P14", type: "psych", title: "Preferisci le vacanze...", leftOption: "Al mare", leftProfiles: [2, 3, 6], upOption: "Indifferente", rightOption: "In montagna", rightProfiles: [1, 4, 5] },
  { id: "P15", type: "psych", title: "Preferisci un weekend...", leftOption: "A casa", leftProfiles: [1, 2], upOption: "Indifferente", rightOption: "Fuori casa", rightProfiles: [3, 4, 5, 6] },
  { id: "P16", type: "psych", title: "Preferisci leggere di...", leftOption: "Politica", leftProfiles: [4, 5], upOption: "Indifferente", rightOption: "Sport/Gossip", rightProfiles: [1, 3, 6] },
  { id: "P17", type: "psych", title: "Preferisci leggere di...", leftOption: "Cronaca nera", leftProfiles: [4, 5], upOption: "Indifferente", rightOption: "Cronaca rosa", rightProfiles: [1, 2, 3, 6] },
  { id: "P18", type: "psych", title: "Su internet cerchi cose...", leftOption: "Da ridere", leftProfiles: [1, 3, 6], upOption: "Indifferente", rightOption: "Interessanti", rightProfiles: [2, 4, 5] },
  { id: "P19", type: "psych", title: "Preferisci...", leftOption: "Parlare", leftProfiles: [2, 5, 6], upOption: "Indifferente", rightOption: "Ascoltare", rightProfiles: [1, 3, 4] },
  { id: "P20", type: "psych", title: "Preferisci una giornata...", leftOption: "Calma", leftProfiles: [1, 2], upOption: "Indifferente", rightOption: "Agitata", rightProfiles: [3, 4, 5, 6] },
  { id: "P21", type: "psych", title: "Ti interessa di più...", leftOption: "Svelare segreti", leftProfiles: [4, 5], upOption: "Indifferente", rightOption: "Conoscere persone", rightProfiles: [2, 3, 6] },
  { id: "P22", type: "psych", title: "Ti appassiona di più...", leftOption: "Il mondo di oggi", leftProfiles: [4, 5], upOption: "Indifferente", rightOption: "Il passato", rightProfiles: [1, 2, 6] },
  { id: "P23", type: "psych", title: "Ti appassiona di più...", leftOption: "Il passato", leftProfiles: [1, 2, 6], upOption: "Indifferente", rightOption: "Il futuro", rightProfiles: [3, 4, 5] },
  { id: "P24", type: "psych", title: "Ti appassiona di più...", leftOption: "Il mondo di oggi", leftProfiles: [1, 2], upOption: "Indifferente", rightOption: "Il futuro", rightProfiles: [3, 4, 5, 6] },
  { id: "P25", type: "psych", title: "Meglio parlare di...", leftOption: "Amore/Amicizia", leftProfiles: [2, 3, 6], upOption: "Indifferente", rightOption: "Politica/Soldi", rightProfiles: [4, 5] },
  { id: "P26", type: "psych", title: "Preferisci cose che...", leftOption: "Rilassano", leftProfiles: [1, 2], upOption: "Indifferente", rightOption: "Eccitano", rightProfiles: [3, 4, 5, 6] },
  { id: "P27", type: "psych", title: "Preferisci il film...", leftOption: "Forrest Gump", leftProfiles: [1, 3, 6], upOption: "Non so", rightOption: "Il Padrino", rightProfiles: [2, 4, 5] },
  { id: "P28", type: "psych", title: "Preferisci il film...", leftOption: "La Pantera Rosa", leftProfiles: [1, 3], upOption: "Non so", rightOption: "Titanic", rightProfiles: [2, 6] },
  { id: "P29", type: "psych", title: "Preferisci il film...", leftOption: "Forrest Gump", leftProfiles: [1, 3, 6], upOption: "Non so", rightOption: "Assassinio sull'Orient Expr.", rightProfiles: [4, 5] },
  { id: "P30", type: "psych", title: "Preferisci il film...", leftOption: "La Pantera Rosa", leftProfiles: [1, 3], upOption: "Non so", rightOption: "Psycho", rightProfiles: [4, 5] },
  { id: "P31", type: "psych", title: "Preferisci il film...", leftOption: "Apocalypse Now", leftProfiles: [4, 5], upOption: "Non so", rightOption: "Casablanca", rightProfiles: [2, 6] },
  { id: "P32", type: "psych", title: "Preferisci il film...", leftOption: "Apocalypse Now", leftProfiles: [5], upOption: "Non so", rightOption: "Match Point", rightProfiles: [4] },
  { id: "P33", type: "psych", title: "Preferisci il film...", leftOption: "Il Padrino", leftProfiles: [2, 4], upOption: "Non so", rightOption: "Silenzio degli Innocenti", rightProfiles: [5] },
  { id: "P34", type: "psych", title: "Preferisci il film...", leftOption: "Titanic", leftProfiles: [2, 6], upOption: "Non so", rightOption: "Match Point", rightProfiles: [4, 5] },
  { id: "P35", type: "psych", title: "Preferisci il film...", leftOption: "Casablanca", leftProfiles: [2, 6], upOption: "Non so", rightOption: "Silenzio degli Innocenti", rightProfiles: [5] },
  { id: "P36", type: "psych", title: "Preferisci il film...", leftOption: "Assassinio sull'Orient Expr.", leftProfiles: [4], upOption: "Non so", rightOption: "Psycho", rightProfiles: [5] },
  { id: "P37", type: "psych", title: "Preferisci il film...", leftOption: "Pretty Woman", leftProfiles: [1, 3, 6], upOption: "Non so", rightOption: "C'era una volta in America", rightProfiles: [2, 4, 5] }
];

// ==========================================
// LOGICA COSTRUZIONE MAZZO
// ==========================================
const buildDeck = () => {
  const others = shuffleArray([...psychQuestions, ...tvQuestions]); 
  const cats = shuffleArray([...catValidationQuestions]); 
  
  let deck = [];

  deck.push(demographicQuestions[0]);
  deck.push(demographicQuestions[1]);

  let count = 0;
  while (others.length > 0 || cats.length > 0) {
    if (count === 4 && cats.length > 0) {
      deck.push(cats.pop()); 
      count = 0; 
    } else if (others.length > 0) {
      deck.push(others.pop());
      count++;
    } else if (cats.length > 0) {
      deck.push(cats.pop());
    }
  }

  return deck.reverse();
};

function App() {
  const [deck, setDeck] = useState(() => buildDeck());
  const [scores, setScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  const [responses, setResponses] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(deck.length - 1);
  const [showResult, setShowResult] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // per l'animazione

  const cardRefs = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck]);

  useEffect(() => {
    if (showResult) {
      sendDataToGoogle();
    }
  }, [showResult]);

  const sendDataToGoogle = async () => {
    setIsSending(true);
    const topCatId = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    const dataToSend = {
      punteggi_raw: scores,
      gatto_vincitore: catProfiles[topCatId].name,
      tutte_le_risposte: responses
    };

    try {
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVfL9_W03IJDP9s3rIOcQvvf2W80pGdqXqYvvOukq3M8EBJBU2LIL5YXTTuwFdeir0/exec";
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(dataToSend)
      });
      console.log("Dataset inviato con successo.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleSwipe = (direction, question) => {
    let chosenText = '';
    if (direction === 'left') chosenText = question.leftOption;
    if (direction === 'right') chosenText = question.rightOption;
    if (direction === 'up') chosenText = question.upOption;

    setResponses(prev => [...prev, {
      id: question.id,
      tipo: question.type,
      risposta: `[${question.title}] -> ${chosenText}`
    }]);

    if (question.type === 'psych' && direction !== 'up') {
      const chosenProfiles = direction === 'left' ? question.leftProfiles : question.rightProfiles;
      const rejectedProfiles = direction === 'left' ? question.rightProfiles : question.leftProfiles;
      
      const pAdd = 4 - chosenProfiles.length;
      const pSub = 4 - rejectedProfiles.length;

      setScores(prev => {
        const next = { ...prev };
        chosenProfiles.forEach(p => next[p] += pAdd);
        rejectedProfiles.forEach(p => next[p] -= pSub);
        return next;
      });
    }

    if (currentIndex === 0) {
      setShowResult(true);
    } else {
      setCurrentIndex(prev => prev - 1);
    }
    setSwipeDirection(null); // resetta lo stato visivo dello swipe
  };

  // Funzione per il click sui bottoni inferiori
  const swipe = async (dir) => {
    if (currentIndex >= 0 && currentIndex < deck.length) {
      if (cardRefs[currentIndex] && cardRefs[currentIndex].current) {
        await cardRefs[currentIndex].current.swipe(dir);
      }
    }
  };

  // --- LISTENER PER LE FRECCETTE DELLA TASTIERA ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Se siamo alla schermata finale, disabilita i tasti
      if (showResult) return;

      switch (event.key) {
        case 'ArrowLeft':
          swipe('left');
          break;
        case 'ArrowRight':
          swipe('right');
          break;
        case 'ArrowUp':
          // Controlliamo che la carta corrente abbia l'opzione "Up"
          if (deck[currentIndex] && deck[currentIndex].upOption) {
            swipe('up');
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Funzione di pulizia: rimuove il listener quando il componente si aggiorna
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, showResult, deck]);

  // Risultati mostrati: Tutti i gatti sopra i 10 punti
  const filteredCatIds = Object.keys(scores)
    .filter(id => scores[id] >= 10)
    .sort((a, b) => scores[b] - scores[a]);

  // Calcoli per la barra di progresso
  const totalQuestions = deck.length;
  const currentQNum = totalQuestions - currentIndex;
  const progressPercent = Math.round((currentQNum / totalQuestions) * 100);
  const remaining = totalQuestions - currentQNum;

  return (
    <div className="app-container">
      
      {showResult ? (
        <div className="result-container scrollable-results">
          <div className="sticky-banner">
            🛡️ Analisi Psicometrica Completata 🛡️
          </div>
          
          {isSending && <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.7)'}}><em>Sincronizzazione dati in corso...</em></p>}
          
          <div className="results-list">
            {filteredCatIds.length > 0 ? (
              filteredCatIds.map(id => (
                <div key={id} className="cat-result-box">
                  <h4>{catProfiles[id].name}</h4>
                  <img src={catProfiles[id].image} alt={catProfiles[id].name} className="cat-image-small" />
                  
                  <p style={{fontSize: '14px', textAlign: 'left', marginTop: '15px'}}>
                    <strong>Personalità:</strong> {catProfiles[id].profile}
                  </p>
                  <p style={{fontSize: '14px', textAlign: 'left', color: '#834d6c'}}>
                    <strong>📺 Serie Consigliate:</strong><br/>
                    {catProfiles[id].genre}
                  </p>
                </div>
              ))
            ) : (
              <div className="cat-result-box">
                <p>Nessun profilo dominante! Sei perfettamente bilanciato tra tutte le personalità feline.</p>
              </div>
            )}
          </div>
          <button onClick={() => window.location.reload()} className="swipe-btn" style={{width: '100%', marginTop: '20px', backgroundColor: '#e2a07c', color: '#fff', border: 'none'}}>Rifai il test</button>
        </div>
      ) : (
        <div className="test-interface">
          
          <div className="app-header">
            {/* Sostituisci il src con {CoverImg} se hai importato l'immagine */}
            <img src="https://via.placeholder.com/500x150/49284d/ffffff?text=SERIE+TV+LIBRI+POP" alt="Hero" className="hero-img" />
            <h1>Quiz</h1>
            <p></p>
            <div className="tags">
              <span className="tag">75 domande</span>
              <span className="tag">~5 minuti</span>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-text">
              <span>Domanda {currentQNum} di {totalQuestions}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-subtext">
              Mancano {remaining} domande
            </div>
            <div className="progress-bar-container">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          
          <div className="card-container">
            {deck.map((q, index) => (
              <TinderCard
                key={q.id + index}
                ref={cardRefs[index]}
                className="swipe"
                preventSwipe={['down']} 
                onSwipe={(dir) => handleSwipe(dir, q)}
                onCardLeftScreen={() => setSwipeDirection(null)}
              >
                <div className="card">
                  <h2>{q.title}</h2>
                  <p className="card-subtitle">Trascina la carta o usa i pulsanti in basso</p>
                </div>
              </TinderCard>
            ))}
          </div>

          {deck[currentIndex] && (
            <div className="action-buttons-container">
              <button className="swipe-btn" onClick={() => swipe('left')}>
                <span className="arrow">←</span>
                <span className="btn-text">{deck[currentIndex].leftOption}</span>
              </button>
              
              {deck[currentIndex].upOption && (
                <button className="swipe-btn" onClick={() => swipe('up')}>
                  <span className="arrow">↑</span>
                  <span className="btn-text">{deck[currentIndex].upOption}</span>
                </button>
              )}

              <button className="swipe-btn" onClick={() => swipe('right')}>
                <span className="arrow">→</span>
                <span className="btn-text">{deck[currentIndex].rightOption}</span>
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default App;