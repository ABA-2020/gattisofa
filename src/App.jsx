import React, { useState, useEffect, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import './App.css'; 

// DEFINIZIONE DEI PROFILI DEI GATTI (AGGIORNATA CON DATABASE REALE)
const catProfiles = {
  1: {
    name: "Paciock",
    breed: "Persiano Grigio (occhi gialli)",
    profile: "Il pigro: tranquillo, calmo, dolce, abitudinario, sedentario, affettuoso, tollerante.",
    tv: "Schitt's Creek, Boris, Camera Café, Derry Girls, 30 Rock, The Good Place."
  },
  2: {
    name: "Peppa Pig",
    breed: "Siamese Bianco a muso nero (occhi azzurri, femmina)",
    profile: "La chiacchierona: empatica, ama le relazioni profonde, dipendente, molto vocale, giocherellona.",
    tv: "L’Amica Geniale, Downton Abbey, Un medico in famiglia, La meglio gioventù, Babylon Berlin."
  },
  3: {
    name: "Joey",
    breed: "Maine Coon Tigrato (occhi grandi sfumature verdi)",
    profile: "L'amicone: eccezionalmente amichevole, intelligente, dolce, socievole, leale, amante dell'acqua.",
    tv: "Heartstopper, Sex Education, Normal People, SKAM Italia, Friday Night Lights."
  },
  4: {
    name: "Miss Marple",
    breed: "Abissino (occhi verdi a mandorla, femmina)",
    profile: "L'investigatrice: intelligentissima, curiosa, investigativa, molto attiva, non sta mai ferma, non violenta.",
    tv: "Il Commissario Montalbano, Don Matteo, Sherlock, Distretto di Polizia, Borgen, House of Cards."
  },
  5: {
    name: "Hannibal",
    breed: "Nigripes (tigrato, minuscolo, piedi neri, occhi neri)",
    profile: "Il killer: fuori dagli schemi, ama il surreale, il violento e il dark.",
    tv: "Hannibal, Dark, American Horror Story, Fargo, Gomorra – La serie."
  }
};

// LE 37 DOMANDE COMPLETE
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

function App() {
  const [scores, setScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [currentIndex, setCurrentIndex] = useState(questions.length - 1);
  const [showResult, setShowResult] = useState(false);
  const [finalCat, setFinalCat] = useState(null);

  // --- RILEVAMENTO DISPOSITIVO ---
  // Se la finestra è più larga di 768px, consideriamo che l'utente sia da PC
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Creiamo dei "collegamenti" (Refs) alle carte per poterle swipare via codice quando si clicca su PC
  const cardRefs = useMemo(
    () => Array(questions.length).fill(0).map(() => React.createRef()),
    []
  );

  const handleButtonClick = (direction, index) => {
    // Quando clicchiamo da PC, diciamo alla carta di animarsi fuori dallo schermo
    if (cardRefs[index] && cardRefs[index].current) {
      cardRefs[index].current.swipe(direction);
    }
  };
  // ------------------------------

  const calculatePoints = (profiles) => {
    return 4 - profiles.length; 
  };

  const handleSwipe = (direction, question) => {
    let chosenProfiles = [];
    let rejectedProfiles = [];

    if (direction === 'left') {
      chosenProfiles = question.leftProfiles;
      rejectedProfiles = question.rightProfiles;
    } else if (direction === 'right') {
      chosenProfiles = question.rightProfiles;
      rejectedProfiles = question.leftProfiles;
    } else {
      return; 
    }

    const pointsToAdd = calculatePoints(chosenProfiles);
    const pointsToSubtract = calculatePoints(rejectedProfiles);

    setScores(prevScores => {
      const newScores = { ...prevScores };
      chosenProfiles.forEach(p => newScores[p] += pointsToAdd);
      rejectedProfiles.forEach(p => newScores[p] -= pointsToSubtract);
      return newScores;
    });

    if (currentIndex === 0) {
      calculateFinalResult();
    } else {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateFinalResult = () => {
    setScores(currentScores => {
      const dominantType = Object.keys(currentScores).reduce((a, b) => currentScores[a] > currentScores[b] ? a : b);
      
      // STAMPA I PUNTEGGI NELLA CONSOLE
      console.log("Punteggi Finali delle 5 tipologie:", currentScores);
      console.log("Tipologia vincente:", dominantType);
      
      setFinalCat(catProfiles[dominantType]);
      setShowResult(true);
      return currentScores;
    });
  };

  const resetTest = () => {
    setScores({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    setCurrentIndex(questions.length - 1);
    setShowResult(false);
    setFinalCat(null);
  };

  return (
    <div className="app-container">
      <h1>Scopri quale gatto sul sofà sei</h1>

      {showResult && finalCat && (
        <div className="result-container">
          <h2>Sei un {finalCat.name}!</h2>
          <h3>{finalCat.breed}</h3>
          <p><strong>Personalità:</strong> {finalCat.profile}</p>
          <p><strong>Cosa dovresti guardare:</strong> {finalCat.tv}</p>
          <button onClick={resetTest}>Rifai il test</button>
        </div>
      )}

      {!showResult && (
        <div className="card-container">
          <p className="counter">Domanda {questions.length - currentIndex} di {questions.length}</p>
          {questions.map((q, index) => (
            <TinderCard
              key={q.id}
              ref={cardRefs[index]} // Aggiungiamo il collegamento alla carta
              className="swipe"
              // Se siamo su PC blocchiamo il trascinamento (up, down, left, right), se su mobile permettiamo left e right
              preventSwipe={isDesktop ? ['up', 'down', 'left', 'right'] : ['up', 'down']} 
              onSwipe={(dir) => handleSwipe(dir, q)}
            >
              <div className="card">
                <h2>{q.title}</h2>
                <div className="options">
                  
                  {/* OPZIONE SINISTRA */}
                  <div 
                    className="left-option"
                    // Se siamo su PC e la carta è la prima in cima, cliccare attiverà l'animazione
                    onClick={() => isDesktop && index === currentIndex && handleButtonClick('left', index)}
                    style={{ cursor: isDesktop ? 'pointer' : 'default' }}
                  >
                    <span>⬅️ {isDesktop ? 'Clicca qui' : 'Swipe Sinistra'}</span>
                    <p>{q.leftOption}</p>
                  </div>

                  {/* OPZIONE DESTRA */}
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