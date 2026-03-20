import React, { useState, useEffect, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import './App.css';

// ← copia unnamed.jpg in src/assets/ rinominandolo banner.jpg
import BannerImg from './assets/banner.jpg';

import PaciockImg from './assets/gatti/Paciock.svg';
import PeppaPigImg from './assets/gatti/Peppa_pig.svg';
import JoeyImg from './assets/gatti/Joey.svg';
import MissMarpleImg from './assets/gatti/Miss_Marple.svg';
import HannibalImg from './assets/gatti/Hannibal.svg';

const catProfiles = {
  1: {
    name: "Paciock",
    subtitle: "Il gatto del relax",
    image: PaciockImg,
    profile: "Una personalità riflessiva e pacata. Ami la stabilità e trovi il tuo equilibrio nella dolcezza dei piccoli gesti quotidiani. Sei una presenza rassicurante, capace di offrire grande tolleranza e un affetto costante a chi ti circonda.",
    tv: "Schitt's Creek, Boris, Camera Café, Derry Girls, 30 Rock, The Good Place."
  },
  2: {
    name: "Peppa Pig",
    subtitle: "Il gatto empatico",
    image: PeppaPigImg,
    profile: "Sei una persona empatica e comunicativa, che vive di relazioni profonde e autentiche. Ami condividere i tuoi pensieri e le tue emozioni, cercando sempre una sintonia speciale con gli altri attraverso il gioco e il dialogo continuo.",
    tv: "L'Amica Geniale, Downton Abbey, Un medico in famiglia, La meglio gioventù, Babylon Berlin."
  },
  3: {
    name: "Joey",
    subtitle: "Il gatto sociale",
    image: JoeyImg,
    profile: "Dotato di una socialità innata e di una grande lealtà. Sei una personalità brillante, aperta alle novità e capace di adattarsi con intelligenza a ogni contesto. La tua energia è contagiosa e la tua natura è limpida come l'acqua che tanto ami.",
    tv: "Heartstopper, Sex Education, Normal People, SKAM Italia, Friday Night Lights."
  },
  4: {
    name: "Miss Marple",
    subtitle: "Il gatto investigativo",
    image: MissMarpleImg,
    profile: "Una mente brillante e dinamica, sempre alla ricerca di nuovi stimoli. La tua curiosità ti spinge a osservare il mondo con occhio critico e investigativo. Sei un'anima attiva e propositiva, che usa l'intelletto per navigare la realtà con gentilezza.",
    tv: "Il Commissario Montalbano, Don Matteo, Sherlock, Distretto di Polizia, Borgen, House of Cards."
  },
  5: {
    name: "Hannibal",
    subtitle: "Il gatto oscuro",
    image: HannibalImg,
    profile: "Una personalità anticonformista e audace, che trova bellezza negli aspetti più insoliti e profondi della vita. Ami tutto ciò che è fuori dagli schemi e non temi di esplorare atmosfere intense e misteriose. Sei uno spirito libero che sfida le convenzioni con originalità.",
    tv: "Hannibal, Dark, American Horror Story, Fargo, Gomorra – La serie."
  }
};

const questions = [
  { id: 1,  title: "Preferisci un viaggio in un posto...",           leftOption: "Nuovo",                              leftProfiles: [1,2],     rightOption: "Dove sono già stato e mi è piaciuto", rightProfiles: [3,4,5] },
  { id: 2,  title: "Preferisci andare a cena...",                    leftOption: "Con gente nuova",                    leftProfiles: [1,2],     rightOption: "Con vecchi amici",                    rightProfiles: [3,4,5] },
  { id: 3,  title: "Preferiresti un lavoro...",                      leftOption: "Stabile ma routinario",              leftProfiles: [3,4,5],   rightOption: "Incerto ma fantasioso",               rightProfiles: [1,2]   },
  { id: 4,  title: "Preferisci un amico...",                         leftOption: "Simpatico",                          leftProfiles: [1],       rightOption: "Che ti capisca",                      rightProfiles: [3]     },
  { id: 5,  title: "Gettarti da uno scoglio molto alto è...",        leftOption: "Da evitare",                         leftProfiles: [1],       rightOption: "Eccitante",                           rightProfiles: [5]     },
  { id: 6,  title: "Preferisci quadri...",                           leftOption: "Arte astratta",                      leftProfiles: [4,5],     rightOption: "Ritratti",                            rightProfiles: [1,3]   },
  { id: 7,  title: "Preferisci quadri...",                           leftOption: "Impressionisti",                     leftProfiles: [1,2,3],   rightOption: "Cubismo",                             rightProfiles: [4,5]   },
  { id: 8,  title: "Preferisci musica...",                           leftOption: "Lirica",                             leftProfiles: [1,2,3],   rightOption: "Jazz",                                rightProfiles: [4,5]   },
  { id: 9,  title: "Preferiresti essere un campione di...",          leftOption: "Discesa libera",                     leftProfiles: [5],       rightOption: "Pallavolo",                           rightProfiles: [1,2,3] },
  { id: 10, title: "Preferiresti essere un campione di...",          leftOption: "Tennis",                             leftProfiles: [4],       rightOption: "Pallavolo",                           rightProfiles: [2,3]   },
  { id: 11, title: "Preferisci giocare a...",                        leftOption: "Burraco",                            leftProfiles: [1,2,3],   rightOption: "Scacchi",                             rightProfiles: [4,5]   },
  { id: 12, title: "Preferisci...",                                  leftOption: "L'amore",                            leftProfiles: [3],       rightOption: "Il successo",                         rightProfiles: [2]     },
  { id: 13, title: "Preferisci...",                                  leftOption: "La filosofia",                       leftProfiles: [2,3],     rightOption: "La matematica",                       rightProfiles: [4,5]   },
  { id: 14, title: "Preferisci le vacanze...",                       leftOption: "Al mare",                            leftProfiles: [5],       rightOption: "In montagna",                         rightProfiles: [1,3]   },
  { id: 15, title: "Preferisci un weekend...",                       leftOption: "Di relax a casa",                    leftProfiles: [1],       rightOption: "Con molte attività fuori casa",        rightProfiles: [3]     },
  { id: 16, title: "Preferisci leggere di...",                       leftOption: "Politica",                           leftProfiles: [3,4],     rightOption: "Sport",                               rightProfiles: [1,2]   },
  { id: 17, title: "Preferisci leggere di...",                       leftOption: "Cronaca nera",                       leftProfiles: [4,5],     rightOption: "Cronaca rosa",                        rightProfiles: [1,2,3] },
  { id: 18, title: "Su internet cerco cose...",                      leftOption: "Da ridere",                          leftProfiles: [1,3],     rightOption: "Interessanti",                        rightProfiles: [2,4]   },
  { id: 19, title: "Preferisci...",                                  leftOption: "Parlare",                            leftProfiles: [2,5],     rightOption: "Ascoltare",                           rightProfiles: [4]     },
  { id: 20, title: "Preferisci una giornata...",                     leftOption: "Calma",                              leftProfiles: [1],       rightOption: "Emozionante ma agitata",              rightProfiles: [3,5]   },
  { id: 21, title: "Ti interessa di più...",                         leftOption: "Svelare un segreto",                 leftProfiles: [4],       rightOption: "Conoscere persone interessanti",      rightProfiles: [2,3]   },
  { id: 22, title: "Ti appassiona di più...",                        leftOption: "La realtà di oggi",                  leftProfiles: [4],       rightOption: "Il mondo passato",                    rightProfiles: [2]     },
  { id: 23, title: "Ti appassiona di più...",                        leftOption: "Il mondo passato",                   leftProfiles: [2],       rightOption: "Il mondo futuro",                     rightProfiles: [5]     },
  { id: 24, title: "Ti appassiona di più...",                        leftOption: "La realtà di oggi",                  leftProfiles: [4],       rightOption: "Il mondo futuro",                     rightProfiles: [5]     },
  { id: 25, title: "È più interessante parlare di...",               leftOption: "Amore/amicizia",                     leftProfiles: [3],       rightOption: "Politica/soldi",                      rightProfiles: [2]     },
  { id: 26, title: "Preferisci cose che...",                         leftOption: "Ti rilassano",                       leftProfiles: [1],       rightOption: "Ti eccitano",                         rightProfiles: [5]     },
  { id: 27, title: "Preferisci...",                                  leftOption: "Forrest Gump",                       leftProfiles: [1],       rightOption: "Il Padrino",                          rightProfiles: [2]     },
  { id: 28, title: "Preferisci...",                                  leftOption: "La Pantera Rosa",                    leftProfiles: [1],       rightOption: "Titanic",                             rightProfiles: [3]     },
  { id: 29, title: "Preferisci...",                                  leftOption: "Forrest Gump",                       leftProfiles: [1],       rightOption: "Assassinio sull'Orient Express",      rightProfiles: [4]     },
  { id: 30, title: "Preferisci...",                                  leftOption: "La Pantera Rosa",                    leftProfiles: [1],       rightOption: "Psycho",                              rightProfiles: [5]     },
  { id: 31, title: "Preferisci...",                                  leftOption: "Apocalypse Now",                     leftProfiles: [2],       rightOption: "Casablanca",                          rightProfiles: [3]     },
  { id: 32, title: "Preferisci...",                                  leftOption: "Apocalypse Now",                     leftProfiles: [2],       rightOption: "Match Point",                         rightProfiles: [4]     },
  { id: 33, title: "Preferisci...",                                  leftOption: "Il Padrino",                         leftProfiles: [2],       rightOption: "Il silenzio degli innocenti",         rightProfiles: [5]     },
  { id: 34, title: "Preferisci...",                                  leftOption: "Titanic",                            leftProfiles: [3],       rightOption: "Match point",                         rightProfiles: [4]     },
  { id: 35, title: "Preferisci...",                                  leftOption: "Casablanca",                         leftProfiles: [3],       rightOption: "Il silenzio degli innocenti",         rightProfiles: [5]     },
  { id: 36, title: "Preferisci...",                                  leftOption: "Assassinio sull'Orient Express",     leftProfiles: [4],       rightOption: "Psycho",                              rightProfiles: [5]     },
  { id: 37, title: "Preferisci...",                                  leftOption: "Pretty Woman",                       leftProfiles: [1,3],     rightOption: "C'era una volta in America",          rightProfiles: [2,4,5] }
];

const shuffleArray = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function App() {
  const [currentQuestions, setCurrentQuestions] = useState(() => shuffleArray(questions));
  const [scores, setScores]         = useState({ 1:0, 2:0, 3:0, 4:0, 5:0 });
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(currentQuestions.length - 1);
  const [showResult, setShowResult] = useState(false);
  const [isDesktop, setIsDesktop]   = useState(window.innerWidth > 768);

  const [formData, setFormData] = useState({
    gender:'', age:'', catMatch:'', tvMatch:'', feedback:'', privacyAccepted: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Console log finale
  useEffect(() => {
    if (!showResult) return;
    console.log('=== PUNTEGGI FINALI ===');
    console.table(Object.entries(scores).map(([id, score]) => ({
      ID: id,
      Gatto: catProfiles[id].name,
      Punteggio: score,
      Stato: score >= 10 ? '✅ CONSIGLIATO' : score <= -10 ? '❌ DA EVITARE' : '⚪ NEUTRO'
    })));
  }, [showResult]);

  const cardRefs = useMemo(
    () => Array(currentQuestions.length).fill(0).map(() => React.createRef()),
    [currentQuestions]
  );

  const swipe = (dir, idx) => {
    cardRefs[idx]?.current?.swipe(dir);
  };

  const calcPoints = profiles => 4 - profiles.length;

  const handleSwipe = (direction, question) => {
    if (direction !== 'left' && direction !== 'right') return;

    const chosen   = direction === 'left' ? question.leftProfiles  : question.rightProfiles;
    const rejected = direction === 'left' ? question.rightProfiles : question.leftProfiles;
    const text     = direction === 'left' ? question.leftOption    : question.rightOption;

    setUserAnswers(prev => [...prev, { id: question.id, domanda: question.title, scelta: text }]);

    const add = calcPoints(chosen);
    const sub = calcPoints(rejected);

    setScores(prev => {
      const s = { ...prev };
      chosen.forEach(p   => s[p] += add);
      rejected.forEach(p => s[p] -= sub);
      return s;
    });

    if (currentIndex === 0) setShowResult(true);
    else setCurrentIndex(prev => prev - 1);
  };

  const resetTest = () => {
    const q = shuffleArray(questions);
    setCurrentQuestions(q);
    setScores({ 1:0, 2:0, 3:0, 4:0, 5:0 });
    setUserAnswers([]);
    setCurrentIndex(q.length - 1);
    setShowResult(false);
    setFormData({ gender:'', age:'', catMatch:'', tvMatch:'', feedback:'', privacyAccepted: false });
    setFormSubmitted(false);
  };

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setIsSending(true);
    const sorted = [...userAnswers]
      .sort((a,b) => a.id - b.id)
      .map(i => ({ ...i, scelta: `[${i.domanda}] -> ${i.scelta}` }));
    const payload = {
      ...formData,
      punteggi_finali: { "1 Paciock": scores[1], "2 Peppa Pig": scores[2], "3 Joey": scores[3], "4 Miss Marple": scores[4], "5 Hannibal": scores[5] },
      tutte_le_risposte: sorted
    };
    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzVfL9_W03IJDP9s3rIOcQvvf2W80pGdqXqYvvOukq3M8EBJBU2LIL5YXTTuwFdeir0/exec",
        { method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body: JSON.stringify(payload) }
      );
      if (res.ok) setFormSubmitted(true);
      else alert("Errore server: " + res.status);
    } catch(err) {
      alert("Errore di rete.");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // Filtro profili
  const sortedIds = Object.keys(scores).sort((a,b) => scores[b] - scores[a]);
  const filteredCatIds = (() => {
    const pos = sortedIds.filter(id => scores[id] >= 10);
    const neg = sortedIds.filter(id => scores[id] <= -10);
    return [...new Set([
      ...(pos.length ? pos : [sortedIds[0]]),
      ...(neg.length ? neg : [sortedIds[sortedIds.length - 1]])
    ])];
  })();

  const answered = currentQuestions.length - 1 - currentIndex;
  const progress = Math.round((answered / (currentQuestions.length - 1)) * 100);
  const remaining = currentQuestions.length - answered - 1;

  return (
    <div className="app-container">

      {/* HERO BANNER */}
      <div className="hero-banner">
        <img src={BannerImg} alt="Serie TV Libri Pop" className="hero-image" />
      </div>

      {/* HERO TEXT */}
      <div className="hero-text">
        <h1>🐱 Scopri il tuo gatto</h1>
        <p className="hero-subtitle">Un test rapido per capire quale gatto sul sofà ti rappresenta davvero.</p>
        <div className="hero-badges">
          <span className="badge">37 domande</span>
          <span className="badge">~3 minuti</span>
        </div>
      </div>

      {/* ── QUIZ ── */}
      {!showResult && (
        <>
          {/* Progress */}
          <div className="progress-area">
            <div className="progress-labels">
              <span>Domanda {answered + 1} di {currentQuestions.length}</span>
              <span>{progress}%</span>
            </div>
            <p className="progress-sublabel">Mancano {remaining} domande</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.max(progress, 1.5)}%` }} />
            </div>
          </div>

          {/* Card stack */}
          <div className="card-container">
            {currentQuestions.map((q, i) => (
              <TinderCard
                key={q.id}
                ref={cardRefs[i]}
                className="swipe"
                preventSwipe={isDesktop ? ['up','down','left','right'] : ['up','down']}
                onSwipe={dir => handleSwipe(dir, q)}
              >
                <div className="card">
                  <h2>{q.title}</h2>
                  <p className="hint">Trascina la carta o usa i pulsanti</p>
                </div>
              </TinderCard>
            ))}
          </div>

          {/* Answer buttons — only for active card */}
          {currentQuestions.map((q, i) =>
            i !== currentIndex ? null : (
              <div key={q.id} className="options">
                <div className="left-option" onClick={() => swipe('left', i)}>
                  <span className="option-label-left">← {q.leftOption}</span>
                </div>
                <div className="right-option" onClick={() => swipe('right', i)}>
                  <span className="option-label-right">{q.rightOption} →</span>
                </div>
              </div>
            )
          )}
        </>
      )}

      {/* ── RESULTS ── */}
      {showResult && (
        <div className="result-container">
          <div className="scroll-notice">
            ⬇️ Scorri fino in fondo per vedere tutti i risultati e lasciarci il tuo feedback!
          </div>

          {filteredCatIds.map(id => {
            const cat = catProfiles[id];
            const isPos = scores[id] >= 10;
            return (
              <div key={id} className={`cat-result-box ${isPos ? 'positive-card' : 'negative-card'}`}>
                <img src={cat.image} alt={cat.name} className="cat-image" />
                <h3>{cat.name}</h3>
                <span className="cat-subtitle">{cat.subtitle}</span>
                <p className="cat-profile"><strong>Personalità:</strong> {cat.profile}</p>
                <p className={`recommendation ${isPos ? 'positive' : 'negative'}`}>
                  <strong>{isPos ? '✅ Serie Consigliate:' : '❌ Da EVITARE:'}</strong><br />{cat.tv}
                </p>
              </div>
            );
          })}

          <hr />

          <div className="feedback-section">
            <h3>Cosa ne pensi?</h3>
            <p>Aiutaci a migliorare l'algoritmo lasciando un feedback!</p>

            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit} className="feedback-form">
                <div className="form-group">
                  <label>Sesso:</label>
                  <select name="gender" value={formData.gender} onChange={handleFormChange} required>
                    <option value="">Seleziona...</option>
                    <option value="M">Uomo</option>
                    <option value="F">Donna</option>
                    <option value="Altro">Altro / Preferisco non specificare</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Età:</label>
                  <input type="number" name="age" value={formData.age} onChange={handleFormChange} required min="10" max="100" placeholder="Es. 25" />
                </div>
                <div className="form-group">
                  <label>Ti ritrovi con la descrizione del gatto?</label>
                  <select name="catMatch" value={formData.catMatch} onChange={handleFormChange} required>
                    <option value="">Seleziona...</option>
                    <option value="Molto">Molto</option>
                    <option value="Abbastanza">Abbastanza</option>
                    <option value="Poco">Poco</option>
                    <option value="Per niente">Per niente</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Confermi l'attinenza delle serie TV proposte/sconsigliate?</label>
                  <select name="tvMatch" value={formData.tvMatch} onChange={handleFormChange} required>
                    <option value="">Seleziona...</option>
                    <option value="Assolutamente sì">Assolutamente sì</option>
                    <option value="In parte">In parte</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Lascia un commento (obbligatorio):</label>
                  <textarea name="feedback" value={formData.feedback} onChange={handleFormChange}
                    maxLength="300" rows="3" required placeholder="Scrivi qui i tuoi pensieri..." />
                  <small className="char-count">{formData.feedback.length} / 300 caratteri</small>
                </div>
                <div className="form-group privacy-group">
                  <label style={{ display:'flex', alignItems:'flex-start', fontWeight:'normal', fontSize:'12px', cursor:'pointer' }}>
                    <input type="checkbox" name="privacyAccepted" checked={formData.privacyAccepted}
                      onChange={handleFormChange} required style={{ marginRight:'10px', marginTop:'3px' }} />
                    <span>Acconsento al trattamento dei miei dati in forma anonima a scopo statistico e di ricerca per il miglioramento dell'algoritmo, nel rispetto del GDPR.</span>
                  </label>
                </div>
                <button type="submit" className="submit-btn" disabled={isSending}>
                  {isSending ? "Invio in corso..." : "Invia Feedback"}
                </button>
              </form>
            ) : (
              <div className="thank-you-message">
                <h4>Grazie per aver partecipato! 🐾</h4>
                <p>Il tuo feedback è stato registrato.</p>
              </div>
            )}
          </div>

          <button onClick={resetTest} className="restart-btn">Rifai il test</button>
        </div>
      )}
    </div>
  );
}