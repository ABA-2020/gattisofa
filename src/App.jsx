import React, { useState, useEffect, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import './App.css'; 

import PaciockImg from './assets/gatti/Paciock.svg';
import PeppaPigImg from './assets/gatti/Peppa_pig.svg';
import JoeyImg from './assets/gatti/Joey.svg';
import MissMarpleImg from './assets/gatti/Miss_Marple.svg';
import HannibalImg from './assets/gatti/Hannibal.svg';
import LuluImg from './assets/gatti/Lulu.svg'; 

const catProfiles = {
  1: { name: "Paciock", image: PaciockImg, profile: "Un gatto riflessivo e pacato. Ama la stabilità del suo territorio e trova il suo equilibrio nella dolcezza di un sonnellino al sole e dei piccoli gesti quotidiani.", genre: "" },
  2: { name: "Peppa Pig", image: PeppaPigImg, profile: "Un gatto empatico e comunicativo, che vive di fusa e relazioni profonde. Cerca sempre il contatto autentico e il calore della sua famiglia umana.", genre: "" },
  3: { name: "Joey", image: JoeyImg, profile: "Dotato di una socialità innata e grande lealtà. Un gatto dalla personalità brillante, capace di conquistare ogni stanza con intelligenza e fascino.", genre: "" },
  4: { name: "Miss Marple", image: MissMarpleImg, profile: "Una mente felina brillante e dinamica, sempre alla ricerca di nuovi stimoli. La sua curiosità la spinge a osservare il mondo dall'alto del punto più nascosto.", genre: "" },
  5: { name: "Hannibal", image: HannibalImg, profile: "Anticonformista e audace, trova bellezza negli angoli più insoliti della casa. Un gatto che ama ciò che è fuori dagli schemi e non teme l'oscurità.", genre: "" },
  6: { name: "Duchessa", image: LuluImg, profile: "Un'anima dolce e profondamente romantica, che vive le emozioni con purezza. Si lascia guidare dal cuore (e da un battito di coda) verso orizzonti incantati.", genre: "n/d" }
};

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const psychQuestions = [
  { id: "P1", type: "psych", title: "Preferisci", leftOption: "Pretty Woman", catL: 1, rightOption: "Il Gattopardo", catR: 2, neutralOption: "Non conosco" },
  { id: "P2", type: "psych", title: "Preferisci", leftOption: "Notting Hill", catL: 1, rightOption: "Via col Vento", catR: 2, neutralOption: "Non conosco" },
  { id: "P3", type: "psych", title: "Preferisci", leftOption: "La Pantera Rosa", catL: 1, rightOption: "Indiana Jones", catR: 3, neutralOption: "Non conosco" },
  { id: "P4", type: "psych", title: "Preferisci", leftOption: "Pretty Woman", catL: 1, rightOption: "Il Padrino", catR: 3, neutralOption: "Non conosco" },
  { id: "P5", type: "psych", title: "Preferisci", leftOption: "Notting Hill", catL: 1, rightOption: "Assassinio su Orient Express", catR: 4, neutralOption: "Non conosco" },
  { id: "P6", type: "psych", title: "Preferisci", leftOption: "La Pantera Rosa", catL: 1, rightOption: "Mystic River", catR: 4, neutralOption: "Non conosco" },
  { id: "P7", type: "psych", title: "Preferisci", leftOption: "La Pantera Rosa", catL: 1, rightOption: "Psycho", catR: 5, neutralOption: "Non conosco" },
  { id: "P8", type: "psych", title: "Preferisci", leftOption: "Casablanca", catL: 1, rightOption: "Il Silenzio degli Innocenti", catR: 5, neutralOption: "Non conosco" },
  { id: "P9", type: "psych", title: "Preferisci", leftOption: "Casablanca", catL: 1, rightOption: "Il Fabbricante di Lacrime", catR: 6, neutralOption: "Non conosco" },
  { id: "P10", type: "psych", title: "Preferisci", leftOption: "Casablanca", catL: 1, rightOption: "Cime Tempestose", catR: 6, neutralOption: "Non conosco" },
  { id: "P11", type: "psych", title: "Preferisci", leftOption: "Via col Vento", catL: 2, rightOption: "Guerre Stellari", catR: 3, neutralOption: "Non conosco" },
  { id: "P12", type: "psych", title: "Preferisci", leftOption: "Troy", catL: 2, rightOption: "C'era una volta in America", catR: 3, neutralOption: "Non conosco" },
  { id: "P13", type: "psych", title: "Preferisci", leftOption: "Via col Vento", catL: 2, rightOption: "Assassinio sull'Orient Express", catR: 4, neutralOption: "Non conosco" },
  { id: "P14", type: "psych", title: "Preferisci", leftOption: "Schindler's List", catL: 2, rightOption: "Match Point", catR: 4, neutralOption: "Non conosco" },
  { id: "P15", type: "psych", title: "Preferisci", leftOption: "Schindler's List", catL: 2, rightOption: "Il Silenzio degli Innocenti", catR: 5, neutralOption: "Non conosco" },
  { id: "P16", type: "psych", title: "Preferisci", leftOption: "Via col Vento", catL: 2, rightOption: "Profondo Rosso", catR: 5, neutralOption: "Non conosco" },
  { id: "P17", type: "psych", title: "Preferisci", leftOption: "Troy", catL: 2, rightOption: "Basic Instinct", catR: 6, neutralOption: "Non conosco" },
  { id: "P18", type: "psych", title: "Preferisci", leftOption: "Schindler's List", catL: 2, rightOption: "Il Fabbricante di Lacrime", catR: 6, neutralOption: "Non conosco" },
  { id: "P19", type: "psych", title: "Preferisci", leftOption: "Il Padrino", catL: 3, rightOption: "Match Point", catR: 4, neutralOption: "Non conosco" },
  { id: "P20", type: "psych", title: "Preferisci", leftOption: "Pulp Fiction", catL: 3, rightOption: "Assassinio sull'Orient Express", catR: 4, neutralOption: "Non conosco" },
  { id: "P21", type: "psych", title: "Preferisci", leftOption: "Indiana Jones", catL: 3, rightOption: "Il Silenzio degli Innocenti", catR: 5, neutralOption: "Non conosco" },
  { id: "P22", type: "psych", title: "Preferisci", leftOption: "Guerre Stellari", catL: 3, rightOption: "Lo Squalo", catR: 5, neutralOption: "Non conosco" },
  { id: "P23", type: "psych", title: "Preferisci", leftOption: "Guerre Stellari", catL: 3, rightOption: "Basic Instinct", catR: 6, neutralOption: "Non conosco" },
  { id: "P24", type: "psych", title: "Preferisci", leftOption: "Indiana Jones", catL: 3, rightOption: "Cime Tempestose", catR: 6, neutralOption: "Non conosco" },
  { id: "P25", type: "psych", title: "Preferisci", leftOption: "Assassinio sul Nilo", catL: 4, rightOption: "Il Silenzio degli Innocenti", catR: 5, neutralOption: "Non conosco" },
  { id: "P26", type: "psych", title: "Preferisci", leftOption: "Match Point", catL: 4, rightOption: "Lo Squalo", catR: 5, neutralOption: "Non conosco" },
  { id: "P27", type: "psych", title: "Preferisci", leftOption: "Match Point", catL: 4, rightOption: "Cime Tempestose", catR: 6, neutralOption: "Non conosco" },
  { id: "P28", type: "psych", title: "Preferisci", leftOption: "Mystic River", catL: 4, rightOption: "Il Fabbricante di Lacrime", catR: 6, neutralOption: "Non conosco" },
  { id: "P29", type: "psych", title: "Preferisci", leftOption: "Psycho", catL: 5, rightOption: "Il Fabbricante di Lacrime", catR: 6, neutralOption: "Non conosco" },
  { id: "P30", type: "psych", title: "Preferisci", leftOption: "Lo Squalo", catL: 5, rightOption: "Cime Tempestose", catR: 6, neutralOption: "Non conosco" },
  { id: "P31", type: "psych", title: "Ti piacciono più i libri di", leftOption: "Felicia Kingsley", catL: 6, rightOption: "Stephen King", catR: 5, neutralOption: "Non conosco" },
  { id: "P32", type: "psych", title: "Ti piacciono più i libri su", leftOption: "Cime Tempestose", catL: 6, rightOption: "Maigret", catR: 4, neutralOption: "Non conosco" },
  { id: "P33", type: "psych", title: "Ti piacciono più i libri di", leftOption: "Felicia Kingsley", catL: 6, rightOption: "Ken Follett", catR: 3, neutralOption: "Non conosco" },
  { id: "P34", type: "psych", title: "Ti piacciono più i libri su", leftOption: "Cime Tempestose", catL: 6, rightOption: "Mussolini l'uomo del secolo", catR: 2, neutralOption: "Non conosco" },
  { id: "P35", type: "psych", title: "Ti piacciono più i libri di", leftOption: "Felicia Kingsley", catL: 6, rightOption: "Villaggio/Fantozzi", catR: 1, neutralOption: "Non conosco" },
  { id: "P36", type: "psych", title: "Ti piacciono più i libri su", leftOption: "Hannibal Lecter", catL: 5, rightOption: "Poirot", catR: 4, neutralOption: "Non conosco" },
  { id: "P37", type: "psych", title: "Ti piacciono più i libri di", leftOption: "Stephen King", catL: 5, rightOption: "Ken Follett", catR: 3, neutralOption: "Non conosco" },
  { id: "P38", type: "psych", title: "Ti piacciono più i libri su", leftOption: "Hannibal Lecter", catL: 5, rightOption: "Mussolini l'uomo del secolo", catR: 2, neutralOption: "Non conosco" },
  { id: "P39", type: "psych", title: "Ti piacciono più i libri di", leftOption: "Stephen King", catL: 5, rightOption: "Villaggio/Fantozzi", catR: 1, neutralOption: "Non conosco" },
  { id: "P40", type: "psych", title: "Ti piacciono più i libri su", leftOption: "Maigret", catL: 4, rightOption: "James Bond", catR: 3, neutralOption: "Non conosco" },
  { id: "P41", type: "psych", title: "Ti piacciono più i libri su", leftOption: "Poirot", catL: 4, rightOption: "Mussolini l'uomo del secolo", catR: 2, neutralOption: "Non conosco" },
  { id: "P42", type: "psych", title: "Ti piacciono più i libri di", leftOption: "Agatha Christie", catL: 4, rightOption: "Villaggio/Fantozzi", catR: 1, neutralOption: "Non conosco" },
  { id: "P43", type: "psych", title: "Ti piacciono più i libri di", leftOption: "Le Carré", catL: 3, rightOption: "Dostoevsky", catR: 2, neutralOption: "Non conosco" },
  { id: "P44", type: "psych", title: "Ti piacciono più i libri di", leftOption: "Le Carré", catL: 3, rightOption: "Elena Ferrante/L'Amica Geniale", catR: 1, neutralOption: "Non conosco" },
  { id: "P45", type: "psych", title: "Ti piacciono più i libri di", leftOption: "Dostoevsky", catL: 2, rightOption: "Elena Ferrante/L'Amica Geniale", catR: 1, neutralOption: "Non conosco" },
  { id: "P46", type: "psych", title: "Ti piace di più", leftOption: "Chalamet - Bones and All", catL: 6, rightOption: "Hugh Grant - Notting Hill", catR: 1, neutralOption: "Non conosco" },
  { id: "P47", type: "psych", title: "Ti piace di più", leftOption: "Chalamet - Bones and All", catL: 6, rightOption: "Brad Pitt - Troy", catR: 2, neutralOption: "Non conosco" },
  { id: "P48", type: "psych", title: "Ti piace di più", leftOption: "Chalamet - Bones and All", catL: 6, rightOption: "Sean Connery - 007", catR: 3, neutralOption: "Non conosco" },
  { id: "P49", type: "psych", title: "Ti piace di più", leftOption: "Chalamet - Bones and All", catL: 6, rightOption: "De Niro - C'era una volta in America", catR: 4, neutralOption: "Non conosco" },
  { id: "P50", type: "psych", title: "Ti piace di più", leftOption: "Chalamet - Bones and All", catL: 6, rightOption: "Douglas - Basic Instinct", catR: 5, neutralOption: "Non conosco" },
  { id: "P51", type: "psych", title: "Ti piace di più", leftOption: "Douglas - Basic Instinct", catL: 5, rightOption: "De Niro - C'era una volta in America", catR: 4, neutralOption: "Non conosco" },
  { id: "P52", type: "psych", title: "Ti piace di più", leftOption: "Douglas - Basic Instinct", catL: 5, rightOption: "Sean Connery - 007", catR: 3, neutralOption: "Non conosco" },
  { id: "P53", type: "psych", title: "Ti piace di più", leftOption: "Douglas - Basic Instinct", catL: 5, rightOption: "Brad Pitt - Troy", catR: 2, neutralOption: "Non conosco" },
  { id: "P54", type: "psych", title: "Ti piace di più", leftOption: "Douglas - Basic Instinct", catL: 5, rightOption: "Hugh Grant - Notting Hill", catR: 1, neutralOption: "Non conosco" },
  { id: "P55", type: "psych", title: "Ti piace di più", leftOption: "De Niro - C'era una volta in America", catL: 4, rightOption: "Sean Connery - 007", catR: 3, neutralOption: "Non conosco" },
  { id: "P56", type: "psych", title: "Ti piace di più", leftOption: "De Niro - C'era una volta in America", catL: 4, rightOption: "Brad Pitt - Troy", catR: 2, neutralOption: "Non conosco" },
  { id: "P57", type: "psych", title: "Ti piace di più", leftOption: "De Niro - C'era una volta in America", catL: 4, rightOption: "Hugh Grant - Notting Hill", catR: 1, neutralOption: "Non conosco" },
  { id: "P58", type: "psych", title: "Ti piace di più", leftOption: "Sean Connery - 007", catL: 3, rightOption: "Brad Pitt - Troy", catR: 2, neutralOption: "Non conosco" },
  { id: "P59", type: "psych", title: "Ti piace di più", leftOption: "Sean Connery - 007", catL: 3, rightOption: "Hugh Grant - Notting Hill", catR: 1, neutralOption: "Non conosco" },
  { id: "P60", type: "psych", title: "Ti piace di più", leftOption: "Brad Pitt - Troy", catL: 2, rightOption: "Hugh Grant - Notting Hill", catR: 1, neutralOption: "Non conosco" },
];

const buildDeck = () => {
  const shuffledPsych = shuffleArray(psychQuestions);
  return [
    ...shuffledPsych,
    { id: "D2", type: "demo_age", title: "Quanti anni hai?" },
    // D1: tre opzioni — leftOption / neutralOption / rightOption
    { id: "D1", type: "demo", title: "Qual è il tuo sesso?", leftOption: "Uomo", neutralOption: "Altro", rightOption: "Donna" }
  ];
};

function App() {
  const [deck] = useState(() => buildDeck());
  const [scores, setScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(deck.length - 1);
  const [showResult, setShowResult] = useState(false);
  const [ageValue, setAgeValue] = useState('');
  // Likert 1-5 per ciascun gatto nella schermata risultati
  const [likert, setLikert] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });

  // --- PRIVACY MODAL STATE ---
  const [privacyAccepted, setPrivacyAccepted] = useState(
    () => localStorage.getItem('privacy_accepted') === 'true'
  );
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const cardRefs = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck]);

  // Blocca lo scroll durante il test, lo riabilita nella pagina risultati
  useEffect(() => {
    if (showResult) {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
  }, [showResult]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showResult) return;
      const isInputFocused = document.activeElement.tagName === 'INPUT';
      if (e.key === 'ArrowLeft' && !isInputFocused) swipe('left');
      if (e.key === 'ArrowRight' && !isInputFocused) swipe('right');
      if (e.key === 'ArrowUp' && !isInputFocused) swipe('up');
      if (e.key === 'Enter' && isInputFocused && deck[currentIndex]?.id === 'D2') handleAgeSubmit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showResult, ageValue]);

  const sendDataToGoogle = async (finalScores, finalResponses) => {
    const mappaRisposte = {};
    finalResponses.forEach(r => { mappaRisposte[r.id] = r.risposta; });
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: import.meta.env.VITE_TOKEN,
          punteggi: finalScores, 
          risposte: mappaRisposte 
        }),
      });
    } catch (err) {
      console.error('Errore invio dati:', err);
    }
  };

  const sendLikertToGoogle = async (likertValues) => {
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: import.meta.env.VITE_TOKEN,
          likert: likertValues,
        }),
      });
    } catch (err) {
      console.error('Errore invio likert:', err);
    }
  };

  const handleLikert = (catId, value) => {
    setLikert(prev => {
      const updated = { ...prev, [catId]: value };
      // Se tutti e 6 i gatti hanno un valore, invia automaticamente
      const allFilled = Object.values(updated).every(v => v !== null);
      if (allFilled) sendLikertToGoogle(updated);
      return updated;
    });
  };

  const swipe = async (dir) => {
    if (currentIndex < 0 || currentIndex >= deck.length) return;
    if (cardRefs[currentIndex]?.current) {
      await cardRefs[currentIndex].current.swipe(dir);
    }
  };

  const handleAgeSubmit = (e) => {
    if (e) e.preventDefault();
    if (ageValue && ageValue.trim() !== "") {
      const ageQuestion = deck.find(q => q.id === 'D2');
      if (ageQuestion) handleSwipe('right', ageQuestion);
    }
  };

  const handleSwipe = (direction, question) => {
    let chosen;

    if (question.type === 'demo_age') {
      // Età: valore numerico inserito
      chosen = ageValue;
    } else if (direction === 'up') {
      // Opzione neutra: salva il testo del campo neutralOption ("Non conosco" o "Altro")
      chosen = question.neutralOption || 'Non conosco';
    } else if (direction === 'left') {
      chosen = question.leftOption;
    } else {
      chosen = question.rightOption;
    }

    const newResponses = [...responses, { id: question.id, risposta: chosen }];
    setResponses(newResponses);

    let nextScores = { ...scores };
    if (question.type === 'psych') {
      // Solo left/right modificano i punteggi; up (neutro) non cambia nulla
      if (direction === 'left') {
        nextScores[question.catL] += 1;
        nextScores[question.catR] -= 1;
      } else if (direction === 'right') {
        nextScores[question.catR] += 1;
        nextScores[question.catL] -= 1;
      }
      // direction === 'up' → punteggi invariati
      setScores(nextScores);
    }

    if (currentIndex === 0) {
      setShowResult(true);
      sendDataToGoogle(nextScores, newResponses);
    } else {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const progressPercent = Math.round(((deck.length - currentIndex) / deck.length) * 100);
  const currentQuestionNum = deck.length - currentIndex;
  const currentQuestion = deck[currentIndex];

  // True se la domanda corrente ha un'opzione neutra (tutte le psych + D1)
  const hasNeutral = currentQuestion && !!currentQuestion.neutralOption;

  return (
    <div className={`app-container ${showResult ? 'results-mode' : 'test-mode'}`}>

      {/* PRIVACY MODAL */}
      {!privacyAccepted && (
        <>
          <div className="privacy-overlay" />
          <div className="privacy-modal" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
            <h2 id="privacy-title" className="privacy-modal-title">🔒 Informativa sulla Privacy</h2>
            <p className="privacy-modal-body">
              Questo test raccoglie le tue risposte in <strong>forma completamente anonima</strong>,
              senza alcun dato identificativo personale. Le informazioni vengono utilizzate
              esclusivamente per <strong>fini di ricerca</strong> sui profili cinematografici e
              non sono cedute a terzi né usate a scopi commerciali.
              <br /><br />
              Non viene effettuato alcun tracciamento identificativo. Non raccogliamo nome,
              email, indirizzo IP o qualsiasi altro dato che possa ricondurre a te.
            </p>
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="privacy-policy-link"
            >
              Leggi la Privacy Policy completa →
            </a>
            <label className="privacy-checkbox-label">
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={(e) => setPrivacyChecked(e.target.checked)}
                className="privacy-checkbox"
              />
              <span>Ho letto e accetto l'informativa sulla privacy</span>
            </label>
            <button
              className="privacy-accept-btn"
              disabled={!privacyChecked}
              onClick={() => {
                localStorage.setItem('privacy_accepted', 'true');
                setPrivacyAccepted(true);
              }}
            >
              Accetto e continuo
            </button>
          </div>
        </>
      )}

      {showResult ? (
        <div className="result-container scrollable-results">
          <h2 className="result-title">I tuoi Punteggi Felini</h2>

          {Object.keys(scores).map(id => {
            const score = scores[id];
            const percentage = Math.min(Math.max(((score + 20) / 40) * 100, 0), 100);
            const cat = catProfiles[id];
            return (
              <div key={id} className="cat-result-card">

                {/* Header: immagine + nome + profilo */}
                <div className="cat-result-header">
                  <img src={cat.image} className="cat-result-icon" alt={cat.name} />
                  <div className="cat-result-info">
                    <span className="cat-result-name">{cat.name}</span>
                    <p className="cat-result-profile">{cat.profile}</p>
                  </div>
                </div>

                {/* Barra punteggio */}
                <div className="chart-bar-bg" style={{ marginBottom: '14px' }}>
                  <div className={`chart-bar-fill ${score >= 0 ? 'pos' : 'neg'}`} style={{ width: `${percentage}%` }}>
                    <span className="score-val">{score}</span>
                  </div>
                </div>

                {/* Likert scale */}
                <p className="likert-question">Quanto ti ci ritrovi?</p>
                <div className="likert-scale">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      className={`likert-btn ${likert[id] === val ? 'selected' : ''}`}
                      onClick={() => handleLikert(id, val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="likert-labels">
                  <span>Per niente</span>
                  <span>Moltissimo</span>
                </div>

              </div>
            );
          })}

          <button onClick={() => window.location.reload()} className="retry-btn">Ricomincia</button>
        </div>
      ) : (
        <div className="test-interface">
          {/* Spacer che compensa l'altezza della progress section fixed */}
          <div className="progress-spacer" />
          <div className="progress-section">
            <div className="progress-info">
              <span className="q-count">Domanda {currentQuestionNum} di {deck.length}</span>
              <span className="percent-text">{progressPercent}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          
          <div className="card-container">
            {deck.map((q, index) => {
              if (q.id === 'D2') {
                return (
                  <div
                    key={q.id}
                    className={`swipe ${index === currentIndex ? 'active-card' : 'hidden-card'}`}
                  >
                    <div className="card">
                      <h2>{q.title}</h2>
                      <div className="age-input-overlay-inner">
                        <form onSubmit={handleAgeSubmit} className="age-input-container">
                          <input
                            type="number"
                            id="age-input"
                            name="age"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="off"
                            className="age-input-fixed"
                            placeholder="Età"
                            value={ageValue}
                            onChange={(e) => setAgeValue(e.target.value)}
                          />
                          <button type="submit" className="age-submit-btn-fixed" disabled={!ageValue}>Avanti</button>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <TinderCard
                  key={q.id}
                  ref={cardRefs[index]}
                  onSwipe={(dir) => handleSwipe(dir, q)}
                  preventSwipe={['down']}
                  className={`swipe ${index === currentIndex ? 'active-card' : 'hidden-card'}`}
                >
                  <div className="card">
                    <h2>{q.title}</h2>
                    <p className="card-subtitle">Usa le frecce o swippa</p>
                  </div>
                </TinderCard>
              );
            })}
          </div>

          {/* BOTTONI RISPOSTA */}
          {currentQuestion && currentQuestion.id !== 'D2' && (
            <div className={`action-buttons-container ${hasNeutral ? 'three-buttons' : ''}`}>
              <button className="swipe-btn left" onClick={() => swipe('left')}>
                <span className="arrow">←</span>
                <span className="btn-text">{currentQuestion.leftOption}</span>
              </button>

              {/* Bottone neutro centrale — visibile solo se la domanda ha neutralOption */}
              {hasNeutral && (
                <button className="swipe-btn neutral" onClick={() => swipe('up')}>
                  <span className="arrow">↑</span>
                  <span className="btn-text">{currentQuestion.neutralOption}</span>
                </button>
              )}

              <button className="swipe-btn right" onClick={() => swipe('right')}>
                <span className="arrow">→</span>
                <span className="btn-text">{currentQuestion.rightOption}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;