import React, { useState, useEffect, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import './App.css'; 

import PaciockImg from './assets/gatti/Paciock.svg';
import PeppaPigImg from './assets/gatti/Peppa_pig.svg';
import JoeyImg from './assets/gatti/Joey.svg';
import MissMarpleImg from './assets/gatti/Miss_Marple.svg';
import HannibalImg from './assets/gatti/Hannibal.svg';
import LuluImg from './assets/gatti/Lulu.svg'; 

const catProfiles = {
  1: { name: "L'Abitudinario", image: PaciockImg, profile: "Una personalità riflessiva e pacata. Ami la stabilità e trovi il tuo equilibrio nella dolcezza dei piccoli gesti quotidiani.", genre: "Comedy / Sitcom" },
  2: { name: "L'Anima Sensibile", image: PeppaPigImg, profile: "Sei una persona empatica e comunicativa, che vive di relazioni profonde e autentiche.", genre: "Family Drama / Storico" },
  3: { name: "Il Carismatico", image: JoeyImg, profile: "Dotato di una socialità innata e lealtà. Sei una personalità brillante, capace di adattarsi con intelligenza.", genre: "Pop / Cult / Fantasy" },
  4: { name: "L'Esploratrice", image: MissMarpleImg, profile: "Una mente brillante e dinamica, sempre alla ricerca di stimoli. La tua curiosità ti spinge a osservare il mondo.", genre: "Crime / Mystery / Politico" },
  5: { name: "L'Alternativo", image: HannibalImg, profile: "Anticonformista e audace, trovi bellezza negli aspetti più insoliti. Ami ciò che è fuori dagli schemi.", genre: "Horror / Thriller / Sci-Fi" },
  6: { name: "La Sognatrice", image: LuluImg, profile: "Un'anima dolce e profondamente romantica, che vive le emozioni con purezza. Ti lasci guidare dal cuore.", genre: "Teen / Romance / Young Adult" }
};

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const demographicQuestions = [
  { id: "D1", type: "demo", title: "Qual è il tuo sesso?", leftOption: "Uomo", upOption: "Altro / ND", rightOption: "Donna" },
  { id: "D2", type: "demo_age", title: "Quanti anni hai?" },
];

const catValidationQuestions = [
  { id: "C1", type: "cat", catId: 1, title: "Questo gatto ti piace e lo vorresti a casa?", leftOption: "No", upOption: "Neutro", rightOption: "Sì!" },
  { id: "C2", type: "cat", catId: 2, title: "Questo gatto ti piace e lo vorresti a casa?", leftOption: "No", upOption: "Neutro", rightOption: "Sì!" },
  { id: "C3", type: "cat", catId: 3, title: "Questo gatto ti piace e lo vorresti a casa?", leftOption: "No", upOption: "Neutro", rightOption: "Sì!" },
  { id: "C4", type: "cat", catId: 4, title: "Questo gatto ti piace e lo vorresti a casa?", leftOption: "No", upOption: "Neutro", rightOption: "Sì!" },
  { id: "C5", type: "cat", catId: 5, title: "Questo gatto ti piace e lo vorresti a casa?", leftOption: "No", upOption: "Neutro", rightOption: "Sì!" },
  { id: "C6", type: "cat", catId: 6, title: "Questo gatto ti piace e lo vorresti a casa?", leftOption: "No", upOption: "Neutro", rightOption: "Sì!" },
];

const tvQuestions = [
  { id: "T1", type: "tv", title: "Cosa ne pensi di 'The Office'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T2", type: "tv", title: "Cosa ne pensi di 'Friends'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T3", type: "tv", title: "Cosa ne pensi di 'Boris'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T4", type: "tv", title: "Cosa ne pensi di 'Scrubs'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T5", type: "tv", title: "Cosa ne pensi di 'Ted Lasso'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T6", type: "tv", title: "Cosa ne pensi di 'This Is Us'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T7", type: "tv", title: "Cosa ne pensi di 'Normal People'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T8", type: "tv", title: "Cosa ne pensi di 'The Crown'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T9", type: "tv", title: "Cosa ne pensi di 'Scenes from a Marriage'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T10", type: "tv", title: "Cosa ne pensi di 'Mad Men'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T11", type: "tv", title: "Cosa ne pensi di 'Game of Thrones'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T12", type: "tv", title: "Cosa ne pensi di 'Lost'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T13", type: "tv", title: "Cosa ne pensi di 'The Boys'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T14", type: "tv", title: "Cosa ne pensi di 'Vikings'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T15", type: "tv", title: "Cosa ne pensi di 'Arcane'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T16", type: "tv", title: "Cosa ne pensi di 'True Detective'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T17", type: "tv", title: "Cosa ne pensi di 'Mindhunter'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T18", type: "tv", title: "Cosa ne pensi di 'House of Cards'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T19", type: "tv", title: "Cosa ne pensi di 'Succession'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T20", type: "tv", title: "Cosa ne pensi di 'Fargo'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T21", type: "tv", title: "Cosa ne pensi di 'Breaking Bad'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T22", type: "tv", title: "Cosa ne pensi di 'The Sopranos'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T23", type: "tv", title: "Cosa ne pensi di 'Dark'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T24", type: "tv", title: "Cosa ne pensi di 'Black Mirror'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T25", type: "tv", title: "Cosa ne pensi di 'Mr. Robot'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T26", type: "tv", title: "Cosa ne pensi di 'Euphoria'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T27", type: "tv", title: "Cosa ne pensi di 'Elite'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T28", type: "tv", title: "Cosa ne pensi di 'Dawson’s Creek'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T29", type: "tv", title: "Cosa ne pensi di 'Skins'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
  { id: "T30", type: "tv", title: "Cosa ne pensi di '90210'?", leftOption: "No", upOption: "Mai vista", rightOption: "La amo" },
];

const psychQuestions = [
  { id: "P1", type: "psych", title: "Preferisci un viaggio in un posto...", leftOption: "Nuovo", leftProfiles: [1, 2, 6], rightOption: "Già visitato", rightProfiles: [3, 4, 5] },
  { id: "P2", type: "psych", title: "Preferisci andare a cena...", leftOption: "Gente nuova", leftProfiles: [1, 2, 6], rightOption: "Vecchi amici", rightProfiles: [3, 4, 5] },
  { id: "P3", type: "psych", title: "Preferiresti un lavoro...", leftOption: "Stabile", leftProfiles: [3, 4, 5], rightOption: "Fantasioso", rightProfiles: [1, 2, 6] },
  { id: "P4", type: "psych", title: "Preferisci un amico...", leftOption: "Simpatico", leftProfiles: [1, 3], rightOption: "Che ti capisca", rightProfiles: [2, 4, 6] },
  { id: "P5", type: "psych", title: "Gettarti da uno scoglio alto è...", leftOption: "Da evitare", leftProfiles: [1, 2, 6], rightOption: "Eccitante", rightProfiles: [3, 4, 5] },
  { id: "P6", type: "psych", title: "Preferisci quadri di...", leftOption: "Arte astratta", leftProfiles: [4, 5], rightOption: "Ritratti", rightProfiles: [1, 2, 3, 6] },
  { id: "P7", type: "psych", title: "Preferisci quadri...", leftOption: "Impressionisti", leftProfiles: [1, 2, 3, 6], rightOption: "Cubismo", rightProfiles: [4, 5] },
  { id: "P8", type: "psych", title: "Preferisci musica...", leftOption: "Lirica", leftProfiles: [1, 2, 3, 6], rightOption: "Jazz", rightProfiles: [4, 5] },
  { id: "P9", type: "psych", title: "Saresti campione di...", leftOption: "Discesa libera", leftProfiles: [3, 5], rightOption: "Pallavolo", rightProfiles: [1, 2, 4, 6] },
  { id: "P10", type: "psych", title: "Saresti campione di...", leftOption: "Tennis", leftProfiles: [4, 5], rightOption: "Pallavolo", rightProfiles: [2, 3, 6] },
  { id: "P11", type: "psych", title: "Preferisci giocare a...", leftOption: "Burraco", leftProfiles: [1, 2, 3, 6], rightOption: "Scacchi", rightProfiles: [4, 5] },
  { id: "P12", type: "psych", title: "Preferisci...", leftOption: "L'amore", leftProfiles: [2, 3, 6], rightOption: "Il successo", rightProfiles: [4, 5] },
  { id: "P13", type: "psych", title: "Preferisci studiare...", leftOption: "Filosofia", leftProfiles: [2, 3, 6], rightOption: "Matematica", rightProfiles: [4, 5] },
  { id: "P14", type: "psych", title: "Preferisci le vacanze...", leftOption: "Al mare", leftProfiles: [2, 3, 6], rightOption: "In montagna", rightProfiles: [1, 4, 5] },
  { id: "P15", type: "psych", title: "Preferisci un weekend...", leftOption: "A casa", leftProfiles: [1, 2], rightOption: "Fuori casa", rightProfiles: [3, 4, 5, 6] },
  { id: "P16", type: "psych", title: "Preferisci leggere di...", leftOption: "Politica", leftProfiles: [4, 5], rightOption: "Sport/Gossip", rightProfiles: [1, 3, 6] },
  { id: "P17", type: "psych", title: "Preferisci leggere di...", leftOption: "Cronaca nera", leftProfiles: [4, 5], rightOption: "Cronaca rosa", rightProfiles: [1, 2, 3, 6] },
  { id: "P18", type: "psych", title: "Su internet cerchi cose...", leftOption: "Da ridere", leftProfiles: [1, 3, 6], rightOption: "Interessanti", rightProfiles: [2, 4, 5] },
  { id: "P19", type: "psych", title: "Preferisci...", leftOption: "Parlare", leftProfiles: [2, 5, 6], rightOption: "Ascoltare", rightProfiles: [1, 3, 4] },
  { id: "P20", type: "psych", title: "Preferisci una giornata...", leftOption: "Calma", leftProfiles: [1, 2], rightOption: "Agitata", rightProfiles: [3, 4, 5, 6] },
  { id: "P21", type: "psych", title: "Ti interessa di più...", leftOption: "Svelare segreti", leftProfiles: [4, 5], rightOption: "Conoscere persone", rightProfiles: [2, 3, 6] },
  { id: "P22", type: "psych", title: "Ti appassiona di più...", leftOption: "Il mondo di oggi", leftProfiles: [4, 5], rightOption: "Il passato", rightProfiles: [1, 2, 6] },
  { id: "P23", type: "psych", title: "Ti appassiona di più...", leftOption: "Il passato", leftProfiles: [1, 2, 6], rightOption: "Il futuro", rightProfiles: [3, 4, 5] },
  { id: "P24", type: "psych", title: "Ti appassiona di più...", leftOption: "Il mondo di oggi", leftProfiles: [1, 2], rightOption: "Il futuro", rightProfiles: [3, 4, 5, 6] },
  { id: "P25", type: "psych", title: "Meglio parlare di...", leftOption: "Amore/Amicizia", leftProfiles: [2, 3, 6], rightOption: "Politica/Soldi", rightProfiles: [4, 5] },
  { id: "P26", type: "psych", title: "Preferisci cose che...", leftOption: "Rilassano", leftProfiles: [1, 2], rightOption: "Eccitano", rightProfiles: [3, 4, 5, 6] },
  { id: "P27", type: "psych", title: "Preferisci il film...", leftOption: "Forrest Gump", leftProfiles: [1, 3, 6], rightOption: "Il Padrino", rightProfiles: [2, 4, 5] },
  { id: "P28", type: "psych", title: "Preferisci il film...", leftOption: "La Pantera Rosa", leftProfiles: [1, 3], rightOption: "Titanic", rightProfiles: [2, 6] },
  { id: "P29", type: "psych", title: "Preferisci il film...", leftOption: "Forrest Gump", leftProfiles: [1, 3, 6], rightOption: "Assassinio sull'Orient Express", rightProfiles: [4, 5] },
  { id: "P30", type: "psych", title: "Preferisci il film...", leftOption: "La Pantera Rosa", leftProfiles: [1, 3], rightOption: "Psycho", rightProfiles: [4, 5] },
  { id: "P31", type: "psych", title: "Preferisci il film...", leftOption: "Apocalypse Now", leftProfiles: [4, 5], rightOption: "Casablanca", rightProfiles: [2, 6] },
  { id: "P32", type: "psych", title: "Preferisci il film...", leftOption: "Apocalypse Now", leftProfiles: [5], rightOption: "Match Point", rightProfiles: [4] },
  { id: "P33", type: "psych", title: "Preferisci il film...", leftOption: "Il Padrino", leftProfiles: [2, 4], rightOption: "Il silenzio degli innocenti", rightProfiles: [5] },
  { id: "P34", type: "psych", title: "Preferisci il film...", leftOption: "Titanic", leftProfiles: [2, 6], rightOption: "Match Point", rightProfiles: [4, 5] },
  { id: "P35", type: "psych", title: "Preferisci il film...", leftOption: "Casablanca", leftProfiles: [2, 6], rightOption: "Il silenzio degli innocenti", rightProfiles: [5] },
  { id: "P36", type: "psych", title: "Preferisci il film...", leftOption: "Assassinio sull'Orient Express", leftProfiles: [4], rightOption: "Psycho", rightProfiles: [5] },
  { id: "P37", type: "psych", title: "Preferisci il film...", leftOption: "Pretty Woman", leftProfiles: [1, 3, 6], rightOption: "C'era una volta in America", rightProfiles: [2, 4, 5] }
];

const buildDeck = () => {
  const others = shuffleArray([...psychQuestions, ...tvQuestions]); 
  const cats = shuffleArray([...catValidationQuestions]); 
  let deck = [];
  deck.push(demographicQuestions[0]);
  deck.push(demographicQuestions[1]);
  let count = 0;
  while (others.length > 0 || cats.length > 0) {
    if (count === 4 && cats.length > 0) { deck.push(cats.pop()); count = 0; }
    else if (others.length > 0) { deck.push(others.pop()); count++; }
    else if (cats.length > 0) { deck.push(cats.pop()); }
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
  const [ageValue, setAgeValue] = useState('');

  // Riferimento per l'input dell'età per forzare il focus su mobile
  const ageInputRef = useRef(null);
  const cardRefs = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck]);

  const sendDataToGoogle = async () => {
    setIsSending(true);
    const topCatId = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const orderedIds = ["D1", "D2", ...Array.from({length: 6}, (_, i) => `C${i+1}`), ...Array.from({length: 30}, (_, i) => `T${i+1}`), ...Array.from({length: 37}, (_, i) => `P${i+1}`)];
    const risposteOrdinate = orderedIds.map(id => {
      const found = responses.find(r => r.id === id);
      return found ? found.risposta : `[Nessuna risposta per ${id}] -> Vuoto`;
    });
    const dataToSend = { punteggi_raw: scores, gatto_vincitore: catProfiles[topCatId].name, tutte_le_risposte: risposteOrdinate };
    try {
      const URL = "https://script.google.com/macros/s/AKfycbzjyygOfGka_MczHbUUjJBHNnDWygKaOOTnarb5Y5wtXUCeaTLW83sqUgh_aUt9593S/exec";
      await fetch(URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(dataToSend) });
    } catch (e) { console.error(e); } finally { setIsSending(false); }
  };

  useEffect(() => {
    if (showResult) sendDataToGoogle();
  }, [showResult]);

  // EFFETTO PER IL FOCUS AUTOMATICO SULL'ETÀ
  useEffect(() => {
    const q = deck[currentIndex];
    if (q && q.type === 'demo_age') {
      // Aspettiamo un attimo che la carta finisca l'animazione di entrata
      setTimeout(() => {
        if (ageInputRef.current) {
          ageInputRef.current.focus();
          // Su alcuni iOS serve scrollare leggermente per far apparire la tastiera
          ageInputRef.current.click();
        }
      }, 300);
    }
  }, [currentIndex, deck]);

  const swipe = async (dir) => {
    if (currentIndex >= 0 && cardRefs[currentIndex]?.current) {
      await cardRefs[currentIndex].current.swipe(dir);
    }
  };

  const handleAgeSubmit = () => {
    if (ageValue && ageValue.trim() !== "") {
      swipe('right');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showResult || document.activeElement.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') swipe('left');
      if (e.key === 'ArrowRight') swipe('right');
      if (e.key === 'ArrowUp' && deck[currentIndex]?.upOption) swipe('up');
      if (e.key === 'Enter' && deck[currentIndex]?.type === 'demo_age') handleAgeSubmit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showResult, deck, ageValue]);

  const handleSwipe = (direction, question) => {
    let chosen = direction === 'left' ? question.leftOption : direction === 'right' ? question.rightOption : question.upOption;
    if (question.type === 'demo_age') chosen = ageValue;

    setResponses(prev => [...prev, { id: question.id, risposta: `[${question.title}] -> ${chosen}` }]);

    if (question.type === 'psych' && direction !== 'up') {
      const chosenP = direction === 'left' ? question.leftProfiles : question.rightProfiles;
      const rejectedP = direction === 'left' ? question.rightProfiles : question.leftProfiles;
      setScores(prev => {
        const next = { ...prev };
        chosenP.forEach(p => next[p] += (4 - chosenP.length));
        rejectedP.forEach(p => next[p] -= (4 - rejectedP.length));
        return next;
      });
    }
    if (currentIndex === 0) setShowResult(true);
    else setCurrentIndex(prev => prev - 1);
  };

  const positiveCats = Object.keys(scores).filter(id => scores[id] >= 10).sort((a, b) => scores[b] - scores[a]);
  const negativeCats = Object.keys(scores).filter(id => scores[id] <= -10).sort((a, b) => scores[a] - scores[b]);
  const progressPercent = Math.round(((deck.length - currentIndex) / deck.length) * 100);

  const currentQuestion = deck[currentIndex];

  return (
    <div className="app-container">
      {showResult ? (
        <div className="result-container scrollable-results">
          <div className="sticky-banner">🛡️ Analisi Completata 🛡️</div>
          <div className="results-list">
            {positiveCats.length > 0 && <div className="results-section"><h3 className="section-title">✅ Serie e Generi Consigliati</h3>{positiveCats.map(id => <div key={id} className="cat-result-box positive-box"><p className="genre-text">{catProfiles[id].genre}</p></div>)}</div>}
            {negativeCats.length > 0 && <div className="results-section"><h3 className="section-title">❌ Serie e Generi da Evitare</h3>{negativeCats.map(id => <div key={id} className="cat-result-box negative-box"><p className="genre-text-neg">{catProfiles[id].genre}</p></div>)}</div>}
          </div>
          <button onClick={() => window.location.reload()} className="swipe-btn" style={{width: '100%', marginTop: '20px', background: '#e2a07c', color: '#fff'}}>Rifai il test</button>
        </div>
      ) : (
        <div className="test-interface">
          <div className="progress-section">
            <div className="progress-text">
              <span>Domanda {deck.length - currentIndex} di {deck.length}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-bar-container"><div className="progress-fill" style={{ width: `${progressPercent}%` }}></div></div>
          </div>

          <div className="card-container">
            {deck.map((q, index) => {
              const isAge = q.type === 'demo_age';
              return (
                <TinderCard 
                  key={q.id + index} 
                  ref={cardRefs[index]} 
                  className="swipe" 
                  // BLOCCA SWIPE FISICO PER L'ETÀ
                  preventSwipe={isAge ? ['up','down','left','right'] : ['down', ...(q.upOption ? [] : ['up'])]} 
                  onSwipe={(dir) => handleSwipe(dir, q)}
                >
                  <div className="card">
                    {q.type === 'cat' && <div className="cat-preview-container"><img src={catProfiles[q.catId].image} alt="Cat" className="cat-circle-img" /><strong>{catProfiles[q.catId].name}</strong><p className="cat-full-desc">"{catProfiles[q.catId].profile}"</p></div>}
                    <h2 style={{ fontSize: q.type === 'cat' ? '18px' : '22px' }}>{q.title}</h2>
                    
                    {isAge ? (
                      <div className="age-input-container">
                        <input 
                          ref={ageInputRef}
                          type="number" 
                          inputMode="numeric" 
                          pattern="[0-9]*"
                          className="age-input" 
                          placeholder="Scrivi qui..." 
                          value={ageValue} 
                          onChange={(e) => setAgeValue(e.target.value)} 
                          // Evita che il click sull'input faccia "ballare" la carta
                          onPointerDown={(e) => e.stopPropagation()}
                        />
                        <button className="age-submit-btn" onClick={handleAgeSubmit} disabled={!ageValue || ageValue.trim()===""}>Avanti</button>
                      </div>
                    ) : (
                      <p className="card-subtitle">Trascina o usa i pulsanti</p>
                    )}
                  </div>
                </TinderCard>
              );
            })}
          </div>

          {/* MOSTRA BOTTONI SOLO SE NON È LA DOMANDA DELL'ETÀ */}
          {currentQuestion && currentQuestion.type !== 'demo_age' && (
            <div className="action-buttons-container">
              <button className="swipe-btn" onClick={() => swipe('left')}><span className="arrow">←</span><span className="btn-text">{currentQuestion.leftOption}</span></button>
              {currentQuestion.upOption && <button className="swipe-btn" onClick={() => swipe('up')}><span className="arrow">↑</span><span className="btn-text">{currentQuestion.upOption}</span></button>}
              <button className="swipe-btn" onClick={() => swipe('right')}><span className="arrow">→</span><span className="btn-text">{currentQuestion.rightOption}</span></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;