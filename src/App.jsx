import React, { useState, useEffect, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import './App.css'; 

import PaciockImg from './assets/gatti/Paciock.svg';
import PeppaPigImg from './assets/gatti/Peppa_pig.svg';
import JoeyImg from './assets/gatti/Joey.svg';
import MissMarpleImg from './assets/gatti/Miss_Marple.svg';
import HannibalImg from './assets/gatti/Hannibal.svg';

const catProfiles = {
  1: {
    name: "Paciock",
    image: PaciockImg,
    profile: "Una personalità riflessiva e pacata. Ami la stabilità e trovi il tuo equilibrio nella dolcezza dei piccoli gesti quotidiani. Sei una presenza rassicurante, capace di offrire grande tolleranza e un affetto costante a chi ti circonda.",
    tv: "Schitt's Creek, Boris, Camera Café, Derry Girls, 30 Rock, The Good Place."
  },
  2: {
    name: "Peppa Pig",
    image: PeppaPigImg,
    profile: "Sei una persona empatica e comunicativa, che vive di relazioni profonde e autentiche. Ami condividere i tuoi pensieri e le tue emozioni, cercando sempre una sintonia speciale con gli altri attraverso il gioco e il dialogo continuo.",
    tv: "L’Amica Geniale, Downton Abbey, Un medico in famiglia, La meglio gioventù, Babylon Berlin."
  },
  3: {
    name: "Joey",
    image: JoeyImg,
    profile: "Dotato di una socialità innata e di una grande lealtà. Sei una personalità brillante, aperta alle novità e capace di adattarsi con intelligenza a ogni contesto. La tua energia è contagiosa e la tua natura è limpida come l'acqua che tanto ami.",
    tv: "Heartstopper, Sex Education, Normal People, SKAM Italia, Friday Night Lights."
  },
  4: {
    name: "Miss Marple",
    image: MissMarpleImg,
    profile: "Una mente brillante e dinamica, sempre alla ricerca di nuovi stimoli. La tua curiosità ti spinge a osservare il mondo con occhio critico e investigativo. Sei un’anima attiva e propositiva, che usa l’intelletto per navigare la realtà con gentilezza.",
    tv: "Il Commissario Montalbano, Don Matteo, Sherlock, Distretto di Polizia, Borgen, House of Cards."
  },
  5: {
    name: "Hannibal",
    image: HannibalImg,
    profile: "Una personalità anticonformista e audace, che trova bellezza negli aspetti più insoliti e profondi della vita. Ami tutto ciò che è fuori dagli schemi e non temi di esplorare atmosfere intense e misteriose. Sei uno spirito libero che sfida le convenzioni con originalità.",
    tv: "Hannibal, Dark, American Horror Story, Fargo, Gomorra – La serie."
  }
};

const questions = [
  { id: 1, title: "Preferisci un viaggio in un posto...", leftOption: "Nuovo", leftProfiles: [1, 2], rightOption: "Dove sono già stato e mi è piaciuto", rightProfiles: [3, 4, 5] },
  { id: 2, title: "Preferisci andare a cena...", leftOption: "Con gente nuova", leftProfiles: [1, 2], rightOption: "Con vecchi amici", rightProfiles: [3, 4, 5] },
  { id: 3, title: "Preferiresti un lavoro...", leftOption: "Stabile ma routinario", leftProfiles: [3, 4, 5], rightOption: "Incerto ma fantasioso", rightProfiles: [1, 2] },
  { id: 4, title: "Preferisci un amico...", leftOption: "Simpatico", leftProfiles: [1], rightOption: "Che ti capisca", rightProfiles: [3] },
  { id: 5, title: "Gettarti da uno scoglio molto alto è...", leftOption: "Da evitare", leftProfiles: [1], rightOption: "Eccitante", rightProfiles: [5] },
  { id: 6, title: "Preferisci quadri...", leftOption: "Arte astratta", leftProfiles: [4, 5], rightOption: "Ritratti", rightProfiles: [1, 3] },
  { id: 7, title: "Preferisci quadri...", leftOption: "Impressionisti", leftProfiles: [1, 2, 3], rightOption: "Cubismo", rightProfiles: [4, 5] },
  { id: 8, title: "Preferisci musica...", leftOption: "Lirica", leftProfiles: [1, 2, 3], rightOption: "Jazz", rightProfiles: [4, 5] },
  { id: 9, title: "Preferiresti essere un campione di...", leftOption: "Discesa libera", leftProfiles: [5], rightOption: "Pallavolo", rightProfiles: [1, 2, 3] },
  { id: 10, title: "Preferiresti essere un campione di...", leftOption: "Tennis", leftProfiles: [4], rightOption: "Pallavolo", rightProfiles: [2, 3] },
  { id: 11, title: "Preferisci giocare a...", leftOption: "Burraco", leftProfiles: [1, 2, 3], rightOption: "Scacchi", rightProfiles: [4, 5] },
  { id: 12, title: "Preferisci...", leftOption: "L'amore", leftProfiles: [3], rightOption: "Il successo", rightProfiles: [2] },
  { id: 13, title: "Preferisci...", leftOption: "La filosofia", leftProfiles: [2, 3], rightOption: "La matematica", rightProfiles: [4, 5] },
  { id: 14, title: "Preferisci le vacanze...", leftOption: "Al mare", leftProfiles: [5], rightOption: "In montagna", rightProfiles: [1, 3] },
  { id: 15, title: "Preferisci un weekend...", leftOption: "Di relax a casa", leftProfiles: [1], rightOption: "Con molte attività fuori casa", rightProfiles: [3] },
  { id: 16, title: "Preferisci leggere di...", leftOption: "Politica", leftProfiles: [3, 4], rightOption: "Sport", rightProfiles: [1, 2] },
  { id: 17, title: "Preferisci leggere di...", leftOption: "Cronaca nera", leftProfiles: [4, 5], rightOption: "Cronaca rosa", rightProfiles: [1, 2, 3] },
  { id: 18, title: "Su internet cerco cose...", leftOption: "Da ridere", leftProfiles: [1, 3], rightOption: "Interessanti", rightProfiles: [2, 4] },
  { id: 19, title: "Preferisci...", leftOption: "Parlare", leftProfiles: [2, 5], rightOption: "Ascoltare", rightProfiles: [4] },
  { id: 20, title: "Preferisci una giornata...", leftOption: "Calma", leftProfiles: [1], rightOption: "Emozionante ma agitata", rightProfiles: [3, 5] },
  { id: 21, title: "Ti interessa di più...", leftOption: "Svelare un segreto", leftProfiles: [4], rightOption: "Conoscere persone interessanti", rightProfiles: [2, 3] },
  { id: 22, title: "Ti appassiona di più...", leftOption: "La realtà di oggi", leftProfiles: [4], rightOption: "Il mondo passato", rightProfiles: [2] },
  { id: 23, title: "Ti appassiona di più...", leftOption: "Il mondo passato", leftProfiles: [2], rightOption: "Il mondo futuro", rightProfiles: [5] },
  { id: 24, title: "Ti appassiona di più...", leftOption: "La realtà di oggi", leftProfiles: [4], rightOption: "Il mondo futuro", rightProfiles: [5] },
  { id: 25, title: "È più interessante parlare di...", leftOption: "Amore/amicizia", leftProfiles: [3], rightOption: "Politica/soldi", rightProfiles: [2] },
  { id: 26, title: "Preferisci cose che...", leftOption: "Ti rilassano", leftProfiles: [1], rightOption: "Ti eccitano", rightProfiles: [5] },
  { id: 27, title: "Preferisci...", leftOption: "Forrest Gump", leftProfiles: [1], rightOption: "Il Padrino", rightProfiles: [2] },
  { id: 28, title: "Preferisci...", leftOption: "La Pantera Rosa", leftProfiles: [1], rightOption: "Titanic", rightProfiles: [3] },
  { id: 29, title: "Preferisci...", leftOption: "Forrest Gump", leftProfiles: [1], rightOption: "Assassinio sull'Orient Express", rightProfiles: [4] },
  { id: 30, title: "Preferisci...", leftOption: "La Pantera Rosa", leftProfiles: [1], rightOption: "Psycho", rightProfiles: [5] },
  { id: 31, title: "Preferisci...", leftOption: "Apocalypse Now", leftProfiles: [2], rightOption: "Casablanca", rightProfiles: [3] },
  { id: 32, title: "Preferisci...", leftOption: "Apocalypse Now", leftProfiles: [2], rightOption: "Match Point", rightProfiles: [4] },
  { id: 33, title: "Preferisci...", leftOption: "Il Padrino", leftProfiles: [2], rightOption: "Il silenzio degli innocenti", rightProfiles: [5] },
  { id: 34, title: "Preferisci...", leftOption: "Titanic", leftProfiles: [3], rightOption: "Match point", rightProfiles: [4] },
  { id: 35, title: "Preferisci...", leftOption: "Casablanca", leftProfiles: [3], rightOption: "Il silenzio degli innocenti", rightProfiles: [5] },
  { id: 36, title: "Preferisci...", leftOption: "Assassinio sull'Orient Express", leftProfiles: [4], rightOption: "Psycho", rightProfiles: [5] },
  { id: 37, title: "Preferisci...", leftOption: "Pretty Woman", leftProfiles: [1, 3], rightOption: "C'era una volta in America", rightProfiles: [2, 4, 5] }
];

// --- FUNZIONE PER MISCHIARE L'ARRAY (Fisher-Yates Shuffle) ---
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  // Inizializziamo lo stato delle domande già mischiato
  const [currentQuestions, setCurrentQuestions] = useState(() => shuffleArray(questions));
  
  const [scores, setScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [userAnswers, setUserAnswers] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(currentQuestions.length - 1);
  const [showResult, setShowResult] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    catMatch: '',
    tvMatch: '',
    feedback: '',
    privacyAccepted: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false); 

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardRefs = useMemo(
    () => Array(currentQuestions.length).fill(0).map(() => React.createRef()),
    [currentQuestions]
  );

  const handleButtonClick = (direction, index) => {
    if (cardRefs[index] && cardRefs[index].current) {
      cardRefs[index].current.swipe(direction);
    }
  };

  const calculatePoints = (profiles) => {
    return 4 - profiles.length; 
  };

  const handleSwipe = (direction, question) => {
    let chosenProfiles = [];
    let rejectedProfiles = [];
    let chosenText = '';

    if (direction === 'left') {
      chosenProfiles = question.leftProfiles;
      rejectedProfiles = question.rightProfiles;
      chosenText = question.leftOption;
    } else if (direction === 'right') {
      chosenProfiles = question.rightProfiles;
      rejectedProfiles = question.leftProfiles;
      chosenText = question.rightOption;
    } else {
      return; 
    }

    // Salviamo l'ID insieme al testo della risposta per poter riordinare tutto alla fine
    setUserAnswers(prev => [...prev, {
      id: question.id,
      domanda: question.title,
      scelta: chosenText
    }]);

    const pointsToAdd = calculatePoints(chosenProfiles);
    const pointsToSubtract = calculatePoints(rejectedProfiles);

    setScores(prevScores => {
      const newScores = { ...prevScores };
      chosenProfiles.forEach(p => newScores[p] += pointsToAdd);
      rejectedProfiles.forEach(p => newScores[p] -= pointsToSubtract);
      return newScores;
    });

    if (currentIndex === 0) {
      setShowResult(true);
    } else {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const resetTest = () => {
    // Rimescoliamo le domande al riavvio
    const newShuffled = shuffleArray(questions);
    setCurrentQuestions(newShuffled);
    
    setScores({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    setUserAnswers([]); 
    setCurrentIndex(newShuffled.length - 1);
    setShowResult(false);
    setFormData({ gender: '', age: '', catMatch: '', tvMatch: '', feedback: '', privacyAccepted: false });
    setFormSubmitted(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    // 1. Riordiniamo le risposte per ID e UNIAMO il titolo alla risposta scelta
    const sortedAnswers = [...userAnswers]
      .sort((a, b) => a.id - b.id)
      .map(item => ({
        ...item,
        // Questo concatena tutto in una stringa perfetta per l'AI
        scelta: `[${item.domanda}] -> ${item.scelta}` 
      }));

    const dataToSend = {
      ...formData,
      punteggi_finali: {
        "1 Paciock": scores[1],
        "2 Peppa Pig": scores[2],
        "3 Joey": scores[3],
        "4 Miss Marple": scores[4],
        "5 Hannibal": scores[5],
      },
      tutte_le_risposte: sortedAnswers
    };

    console.log("=== INIZIO INVIO DATI A GOOGLE ===");
    console.log("Pacchetto dati (Ordinato e formattato):", dataToSend);

    try {
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVfL9_W03IJDP9s3rIOcQvvf2W80pGdqXqYvvOukq3M8EBJBU2LIL5YXTTuwFdeir0/exec";

      // 2. Il fetch aggiornato con l'header text/plain per sicurezza CORS
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8", 
        },
        body: JSON.stringify(dataToSend)
      });
      
      const resultText = await response.text();

      if (response.ok) {
        setFormSubmitted(true);
        console.log("Dati salvati con successo sul Foglio Google!");
      } else {
        alert("Errore dal server Google: " + response.status);
      }

    } catch (error) {
      alert("La richiesta è stata bloccata. Controlla la console.");
      console.error("ERRORE DI RETE/CORS:", error);
    } finally {
      setIsSending(false);
    }
  };

  const filteredCatIds = Object.keys(scores)
    .filter(catId => scores[catId] <= -10 || scores[catId] >= 10)
    .sort((a, b) => scores[b] - scores[a]);

  return (
    <div className="app-container">
      <h1>Scopri la tua gatto+ list</h1>

      {showResult && (
        <div className="result-container scrollable-results">
          
          <div style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
            border: '1px solid #ffeeba',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            ⬇️ Scorri fino in fondo per vedere tutti i risultati e lasciarci il tuo feedback! ⬇️
          </div>

          {filteredCatIds.length > 0 ? (
            filteredCatIds.map(catId => {
              const cat = catProfiles[catId];
              const score = scores[catId];
              return (
                <div key={catId} className="cat-result-box" style={{ textAlign: 'center' }}>
                  <img src={cat.image} alt={cat.name} className="cat-image" />
                  <h3>{cat.name}</h3>
                  
                  <p style={{ fontSize: '14px', fontStyle: 'italic', marginBottom: '15px' }}>
                    <strong>Personalità:</strong> {cat.profile}
                  </p>
                  
                  {score >= 10 ? (
                    <p className="recommendation positive">
                      <strong>✅ Serie Consigliate:</strong><br /> {cat.tv}
                    </p>
                  ) : (
                    <p className="recommendation negative">
                      <strong>❌ Da EVITARE:</strong><br /> {cat.tv}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="recommendation neutral">
              Wow! I tuoi gusti sono perfettamente bilanciati. Non hai una preferenza estrema per nessun genere in particolare!
            </p>
          )}
          
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
                  <textarea 
                    name="feedback" 
                    value={formData.feedback} 
                    onChange={handleFormChange} 
                    maxLength="300" 
                    rows="3" 
                    required 
                    placeholder="Scrivi qui i tuoi pensieri..."
                  />
                  <small className="char-count">{formData.feedback.length} / 300 caratteri</small>
                </div>

                <div className="form-group privacy-group">
                  <label style={{ display: 'flex', alignItems: 'flex-start', fontWeight: 'normal', fontSize: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="privacyAccepted" 
                      checked={formData.privacyAccepted} 
                      onChange={handleFormChange} 
                      required 
                      style={{ marginRight: '10px', marginTop: '3px' }}
                    />
                    <span>
                      Acconsento al trattamento dei miei dati in forma anonima a scopo statistico e di ricerca per il miglioramento dell'algoritmo, nel rispetto del GDPR.
                    </span>
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

      {!showResult && (
        <div className="card-container">
          <p className="counter">Domanda {currentQuestions.length - currentIndex} di {currentQuestions.length}</p>
          {currentQuestions.map((q, index) => (
            <TinderCard
              key={q.id}
              ref={cardRefs[index]}
              className="swipe"
              preventSwipe={isDesktop ? ['up', 'down', 'left', 'right'] : ['up', 'down']} 
              onSwipe={(dir) => handleSwipe(dir, q)}
            >
              <div className="card">
                <h2>{q.title}</h2>
                <div className="options">
                  <div 
                    className="left-option"
                    onClick={() => isDesktop && index === currentIndex && handleButtonClick('left', index)}
                    style={{ cursor: isDesktop ? 'pointer' : 'default' }}
                  >
                    <span>⬅️ {isDesktop ? 'Clicca qui' : 'Swipe Sinistra'}</span>
                    <p>{q.leftOption}</p>
                  </div>
                  <div 
                    className="right-option"
                    onClick={() => isDesktop && index === currentIndex && handleButtonClick('right', index)}
                    style={{ cursor: isDesktop ? 'pointer' : 'default' }}
                  >
                    <span>{isDesktop ? 'Clicca qui' : 'Swipe Destra'} ➡️</span>
                    <p>{q.rightOption}</p>
                  </div>
                </div>
              </div>
            </TinderCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;