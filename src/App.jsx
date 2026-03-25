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
  1: { name: "Paciock", image: PaciockImg },
  2: { name: "Peppa Pig", image: PeppaPigImg },
  3: { name: "Joey", image: JoeyImg },
  4: { name: "Miss Marple", image: MissMarpleImg },
  5: { name: "Hannibal", image: HannibalImg },
  6: { name: "Duchessa", image: LuluImg } 
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
  { id: "P1", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Pretty Woman", catL: 1, rightOption: "Il Gattopardo", catR: 2 },
  { id: "P2", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Notting Hill", catL: 1, rightOption: "Via col Vento", catR: 2 },
  { id: "P3", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "La Pantera Rosa", catL: 1, rightOption: "Indiana Jones", catR: 3 },
  { id: "P4", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Pretty Woman", catL: 1, rightOption: "Il Padrino", catR: 3 },
  { id: "P5", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Notting Hill", catL: 1, rightOption: "Ass. su Orient Express", catR: 4 },
  { id: "P6", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "La Pantera Rosa", catL: 1, rightOption: "Mystic River", catR: 4 },
  { id: "P7", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "La Pantera Rosa", catL: 1, rightOption: "Psycho", catR: 5 },
  { id: "P8", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Casablanca", catL: 1, rightOption: "Silenzio degli Innocenti", catR: 5 },
  { id: "P9", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Casablanca", catL: 1, rightOption: "Fabbricante di Lacrime", catR: 6 },
  { id: "P10", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Casablanca", catL: 1, rightOption: "Cime Tempestose", catR: 6 },
  { id: "P11", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Via col Vento", catL: 2, rightOption: "Guerre Stellari", catR: 3 },
  { id: "P12", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Troy", catL: 2, rightOption: "C'era una volta in America", catR: 3 },
  { id: "P13", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Via col Vento", catL: 2, rightOption: "Sherlock Holmes", catR: 4 },
  { id: "P14", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Troy", catL: 2, rightOption: "La Casa di Carta", catR: 4 },
  { id: "P15", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Via col Vento", catL: 2, rightOption: "L'Esorcista", catR: 5 },
  { id: "P16", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Troy", catL: 2, rightOption: "Arancia Meccanica", catR: 5 },
  { id: "P17", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Schindler's List", catL: 2, rightOption: "Twilight", catR: 6 },
  { id: "P18", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Schindler's List", catL: 2, rightOption: "Colpa delle Stelle", catR: 6 },
  { id: "P19", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Indiana Jones", catL: 3, rightOption: "Sherlock Holmes", catR: 4 },
  { id: "P20", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Il Padrino", catL: 3, rightOption: "La Casa di Carta", catR: 4 },
  { id: "P21", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Guerre Stellari", catL: 3, rightOption: "Shining", catR: 5 },
  { id: "P22", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "C'era una volta in America", catL: 3, rightOption: "Silenzio degli Innocenti", catR: 5 },
  { id: "P23", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Indiana Jones", catL: 3, rightOption: "Twilight", catR: 6 },
  { id: "P24", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Guerre Stellari", catL: 3, rightOption: "Cime Tempestose", catR: 6 },
  { id: "P25", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Sherlock Holmes", catL: 4, rightOption: "Psycho", catR: 5 },
  { id: "P26", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Mystic River", catL: 4, rightOption: "Shining", catR: 5 },
  { id: "P27", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Sherlock Holmes", catL: 4, rightOption: "Fabbricante di Lacrime", catR: 6 },
  { id: "P28", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "La Casa di Carta", catL: 4, rightOption: "Colpa delle Stelle", catR: 6 },
  { id: "P29", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Shining", catL: 5, rightOption: "Cime Tempestose", catR: 6 },
  { id: "P30", type: "psych", title: "Cosa preferiresti vedere?", leftOption: "Arancia Meccanica", catL: 5, rightOption: "Fabbricante di Lacrime", catR: 6 },
  { id: "P31", type: "psych", title: "Preferisci un film...", leftOption: "Leggero", catL: 1, rightOption: "Impegnato", catR: 2 },
  { id: "P32", type: "psych", title: "Preferisci un film...", leftOption: "Rassicurante", catL: 1, rightOption: "Avventuroso", catR: 3 },
  { id: "P33", type: "psych", title: "Preferisci un film...", leftOption: "Lineare", catL: 1, rightOption: "Enigmatico", catR: 4 },
  { id: "P34", type: "psych", title: "Preferisci un film...", leftOption: "Solare", catL: 1, rightOption: "Oscuro", catR: 5 },
  { id: "P35", type: "psych", title: "Preferisci un film...", leftOption: "Realistico", catL: 1, rightOption: "Fiabesco", catR: 6 },
  { id: "P36", type: "psych", title: "Preferisci storie...", leftOption: "Corali", catL: 2, rightOption: "Individualiste", catR: 3 },
  { id: "P37", type: "psych", title: "Preferisci storie...", leftOption: "Emozionali", catL: 2, rightOption: "Cerebrali", catR: 4 },
  { id: "P38", type: "psych", title: "Preferisci storie...", leftOption: "Umaniste", catL: 2, rightOption: "Ciniche", catR: 5 },
  { id: "P39", type: "psych", title: "Preferisci storie...", leftOption: "Malinconiche", catL: 2, rightOption: "Sognanti", catR: 6 },
  { id: "P40", type: "psych", title: "Ami i personaggi...", leftOption: "Eroici", catL: 3, rightOption: "Misteriosi", catR: 4 },
  { id: "P41", type: "psych", title: "Ami i personaggi...", leftOption: "Popolari", catL: 3, rightOption: "Inquietanti", catR: 5 },
  { id: "P42", type: "psych", title: "Ami i personaggi...", leftOption: "Estroversi", catL: 3, rightOption: "Idealisti", catR: 6 },
  { id: "P43", type: "psych", title: "Ti attira di più...", leftOption: "La verità", catL: 4, rightOption: "La follia", catR: 5 },
  { id: "P44", type: "psych", title: "Ti attira di più...", leftOption: "La logica", catL: 4, rightOption: "Il sentimento", catR: 6 },
  { id: "P45", type: "psych", title: "Ti attira di più...", leftOption: "La trasgressione", catL: 5, rightOption: "La purezza", catR: 6 },
  { id: "P46", type: "psych", title: "Cosa ti colpisce?", leftOption: "La trama", catL: 1, rightOption: "La regia", catR: 5 },
  { id: "P47", type: "psych", title: "Cosa ti colpisce?", leftOption: "Il finale", catL: 4, rightOption: "Il viaggio", catR: 3 },
  { id: "P48", type: "psych", title: "Cosa ti colpisce?", leftOption: "Il dialogo", catL: 2, rightOption: "L'immagine", catR: 6 },
  { id: "P49", type: "psych", title: "Preferiresti essere...", leftOption: "Protagonista", catL: 3, rightOption: "Osservatore", catR: 4 },
  { id: "P50", type: "psych", title: "Preferiresti essere...", leftOption: "In gruppo", catL: 2, rightOption: "Solitario", catR: 5 },
  { id: "P51", type: "psych", title: "Il ritmo deve essere...", leftOption: "Cadenzato", catL: 1, rightOption: "Incalzante", catR: 3 },
  { id: "P52", type: "psych", title: "Il ritmo deve essere...", leftOption: "Profondo", catL: 2, rightOption: "Psichedelico", catR: 5 },
  { id: "P53", type: "psych", title: "L'ambientazione...", leftOption: "Domestica", catL: 1, rightOption: "Esotica", catR: 4 },
  { id: "P54", type: "psych", title: "L'ambientazione...", leftOption: "Moderna", catL: 3, rightOption: "Atemporale", catR: 6 },
  { id: "P55", type: "psych", title: "Ti piace quando...", leftOption: "Ridi", catL: 1, rightOption: "Piangi", catR: 2 },
  { id: "P56", type: "psych", title: "Ti piace quando...", leftOption: "Sei al sicuro", catL: 1, rightOption: "Hai paura", catR: 5 },
  { id: "P57", type: "psych", title: "Ti piace quando...", leftOption: "Capisci tutto", catL: 4, rightOption: "Ti perdi", catR: 6 },
  { id: "P58", type: "psych", title: "Segui più...", leftOption: "La testa", catL: 4, rightOption: "Il cuore", catR: 6 },
  { id: "P59", type: "psych", title: "Segui più...", leftOption: "Il dovere", catL: 1, rightOption: "Il piacere", catR: 3 },
  { id: "P60", type: "psych", title: "Segui più...", leftOption: "La realtà", catL: 5, rightOption: "Il sogno", catR: 6 },
];

const buildDeck = () => {
  const shuffledPsych = shuffleArray(psychQuestions);
  return [
    ...shuffledPsych,
    { id: "D2", type: "demo_age", title: "Quanti anni hai?" },
    { id: "D1", type: "demo", title: "Qual è il tuo sesso?", leftOption: "Uomo", rightOption: "Donna" }
  ];
};

function App() {
  const [deck] = useState(() => buildDeck());
  const [scores, setScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(deck.length - 1);
  const [showResult, setShowResult] = useState(false);
  const [ageValue, setAgeValue] = useState('');
  
  const cardRefs = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck]);

  // Gestione Frecce Tastiera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showResult) return;
      const isInputFocused = document.activeElement.tagName === 'INPUT';
      
      if (e.key === 'ArrowLeft' && !isInputFocused) swipe('left');
      if (e.key === 'ArrowRight' && !isInputFocused) swipe('right');
      if (e.key === 'Enter' && isInputFocused && deck[currentIndex]?.id === 'D2') handleAgeSubmit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showResult, ageValue]);

  const sendDataToGoogle = async (finalScores, finalResponses) => {
    const mappaRisposte = {};
    finalResponses.forEach(r => { mappaRisposte[r.id] = r.risposta; });
    const dataToSend = { punteggi_raw: finalScores, risposte_mappate: mappaRisposte };

    try {
      const URL = "https://script.google.com/macros/s/AKfycbwI71lkCOWvykAdorI1TASq9TP7SSapyPrQ7hF_HqhtalwLYUei8hdFKzlvFOQHLXWW8Q/exec";
      await fetch(URL, { method: "POST", mode: "no-cors", cache: "no-cache", body: JSON.stringify(dataToSend) });
    } catch (e) { console.error("Errore invio:", e); }
  };

  const swipe = async (dir) => {
    if (currentIndex >= 0 && cardRefs[currentIndex]?.current) {
      await cardRefs[currentIndex].current.swipe(dir);
    }
  };

  const handleAgeSubmit = (e) => {
    if (e) e.preventDefault();
    if (ageValue && ageValue.trim() !== "") swipe('right');
  };

  const handleSwipe = (direction, question) => {
    let chosen = question.type === 'demo_age' ? ageValue : (direction === 'left' ? question.leftOption : question.rightOption);
    
    const newResponses = [...responses, { id: question.id, risposta: chosen }];
    setResponses(newResponses);

    let nextScores = { ...scores };
    if (question.type === 'psych') {
      if (direction === 'left') { nextScores[question.catL] += 1; nextScores[question.catR] -= 1; }
      else { nextScores[question.catR] += 1; nextScores[question.catL] -= 1; }
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
  const currentQuestion = deck[currentIndex];

  return (
    <div className="app-container">
      {showResult ? (
        <div className="result-container scrollable-results">
          <h2 className="result-title">I tuoi Punteggi Felini</h2>
          <div className="chart-container">
            {Object.keys(scores).map(id => {
              const score = scores[id];
              const percentage = Math.min(Math.max(((score + 20) / 40) * 100, 0), 100);
              return (
                <div key={id} className="chart-row">
                  <div className="chart-label">
                    <img src={catProfiles[id].image} className="chart-icon" alt="" />
                    <span>{catProfiles[id].name}</span>
                  </div>
                  <div className="chart-bar-bg">
                    <div className={`chart-bar-fill ${score >= 0 ? 'pos' : 'neg'}`} style={{ width: `${percentage}%` }}>
                      <span className="score-val">{score}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => window.location.reload()} className="retry-btn">Ricomincia</button>
        </div>
      ) : (
        <div className="test-interface">
          <div className="progress-section">
            <div className="progress-info">
              <span>Domanda {deck.length - currentIndex} di {deck.length}</span>
              <span className="percent-text">{progressPercent}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          
          <div className="card-container">
            {deck.map((q, index) => {
              // Anti-spoiler: rendiamo invisibili tutte le carte tranne quella attiva
              const isCurrent = index === currentIndex;
              return (
                <TinderCard 
                  key={q.id} 
                  ref={cardRefs[index]} 
                  onSwipe={(dir) => handleSwipe(dir, q)}
                  preventSwipe={q.id === 'D2' ? ['up','down','left','right'] : ['up', 'down']}
                  className={`swipe ${isCurrent ? 'active-card' : 'hidden-card'}`}
                >
                  <div className="card">
                    <h2>{q.title}</h2>
                    {q.id === 'D2' ? (
                      <form onSubmit={handleAgeSubmit} className="age-input-container">
                        <input 
                          type="number" 
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="age-input-fixed"
                          placeholder="Età" 
                          value={ageValue}
                          onChange={(e) => setAgeValue(e.target.value)}
                          onPointerDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                        />
                        <button type="submit" className="age-submit-btn-fixed" disabled={!ageValue}>Avanti</button>
                      </form>
                    ) : (
                      <p className="card-subtitle">Usa le frecce o swippa</p>
                    )}
                  </div>
                </TinderCard>
              );
            })}
          </div>

          {currentQuestion && currentQuestion.id !== 'D2' && (
            <div className="action-buttons-container">
              <button className="swipe-btn left" onClick={() => swipe('left')}>
                <span className="arrow">←</span>
                <span className="btn-text">{currentQuestion.leftOption}</span>
              </button>
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