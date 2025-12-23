import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showSessionTypeModal, setShowSessionTypeModal] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [sessionSubject, setSessionSubject] = useState('');
  const [onSessionCompleteCallback, setOnSessionCompleteCallback] = useState(null);

  const openSubjectModal = (duration, callback) => {
    console.log('ModalContext: Opening subject modal with duration:', duration);
    
    // Jouer le son ding.wav
    try {
      const audio = new Audio('/ding.wav');
      audio.play().catch(err => console.log('Erreur lecture audio:', err));
    } catch (err) {
      console.log('Erreur création audio:', err);
    }
    
    setCompletedDuration(duration);
    setOnSessionCompleteCallback(() => callback);
    setShowSubjectModal(true);
  };

  const handleSubjectSubmit = () => {
    if (sessionSubject.trim()) {
      console.log('ModalContext: Subject submitted:', sessionSubject);
      if (onSessionCompleteCallback) {
        onSessionCompleteCallback(completedDuration, sessionSubject);
      }
      setShowSubjectModal(false);
      setSessionSubject('');
      setTimeout(() => {
        setShowSessionTypeModal(true);
      }, 100);
    }
  };

  const handleSessionTypeChoice = (isWorkSession) => {
    console.log(' ModalContext: Session type choice:', isWorkSession ? 'work' : 'break');

    try {
      const soundFile = isWorkSession ? '/break.mp3' : '/notification.mp3';
      const audio = new Audio(soundFile);
      audio.play().catch(err => console.log('Erreur lecture audio:', err));
    } catch (err) {
      console.log('Erreur création audio:', err);
    }
    
    setShowSessionTypeModal(false);
  };

  return (
    <ModalContext.Provider value={{ openSubjectModal }}>
      {children}
      
      {/* Modal pour demander la matière - Toujours monté */}
      {showSubjectModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card max-w-md w-full animate-slide-up">
            <h3 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-white text-center">
              Session terminée !
            </h3>
            {completedDuration > 0 && (
              <p className="text-slate-600 dark:text-slate-300 mb-2 text-center">
                Durée : <span className="font-semibold">{completedDuration} minute{completedDuration > 1 ? 's' : ''}</span>
              </p>
            )}
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-center">
              Quelle matière avez-vous étudiée ?
            </p>

            <div className="space-y-4">
              <input
                type="text"
                value={sessionSubject}
                onChange={(e) => setSessionSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubjectSubmit();
                  }
                }}
              />

              <button
                onClick={handleSubjectSubmit}
                disabled={!sessionSubject.trim()}
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal pour demander le type de prochaine session - Toujours monté */}
      {showSessionTypeModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card max-w-md w-full animate-slide-up">
            <h3 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-white text-center">
              Que voulez-vous faire maintenant ?
            </h3>

            <div className="flex gap-4">
              <button
                onClick={() => handleSessionTypeChoice(true)}
                className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
              >
                Continuer à travailler
              </button>
              <button
                onClick={() => handleSessionTypeChoice(false)}
                className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl"
              >
                Prendre une pause
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </ModalContext.Provider>
  );
};