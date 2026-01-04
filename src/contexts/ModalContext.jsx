import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

const COURSES_KEY = 'etudes_courses';

const loadFavoriteCourseNames = () => {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c) => c && c.favorite === true && typeof c.name === 'string')
      .map((c) => c.name.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
};

export const ModalProvider = ({ children }) => {
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showSessionTypeModal, setShowSessionTypeModal] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [sessionSubject, setSessionSubject] = useState('');
  const [selectedFavorite, setSelectedFavorite] = useState('');
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [onSessionCompleteCallback, setOnSessionCompleteCallback] = useState(null);

  const refreshFavorites = () => {
    setFavoriteCourses(loadFavoriteCourseNames());
  };

  useEffect(() => {
    refreshFavorites();
    const handler = () => refreshFavorites();
    window.addEventListener('coursesUpdated', handler);
    return () => window.removeEventListener('coursesUpdated', handler);
  }, []);

  const favoriteOptions = useMemo(() => favoriteCourses, [favoriteCourses]);

  const openSubjectModal = (duration, callback) => {
    try {
      const audio = new Audio('/ding.wav');
      audio.play().catch(() => {});
    } catch {}

    refreshFavorites();

    setCompletedDuration(duration);
    setOnSessionCompleteCallback(() => callback);
    setSelectedFavorite('');
    setSessionSubject('');
    setShowSubjectModal(true);
  };

  const handleSubjectSubmit = () => {
    const subject = sessionSubject.trim() || 'Session de travail';
    if (onSessionCompleteCallback) {
      onSessionCompleteCallback(completedDuration, subject);
    }
    setShowSubjectModal(false);
    setSessionSubject('');
    setSelectedFavorite('');
    setTimeout(() => {
      setShowSessionTypeModal(true);
    }, 100);
  };

  const handleSessionTypeChoice = (isWorkSession) => {
    try {
      const soundFile = isWorkSession ? '/break.mp3' : '/notification.mp3';
      const audio = new Audio(soundFile);
      audio.play().catch(() => {});
    } catch {}
    setShowSessionTypeModal(false);
  };

  const applyFavoriteToInput = (value) => {
    setSelectedFavorite(value);
    if (value) setSessionSubject(value);
  };

  return (
    <ModalContext.Provider value={{ openSubjectModal, openSessionTypeModal: () => setShowSessionTypeModal(true) }}>
      {children}

      {showSubjectModal &&
        createPortal(
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
                {favoriteOptions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      Cours enregistrés (⭐)
                    </label>
                    <select
                      value={selectedFavorite}
                      onChange={(e) => applyFavoriteToInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choisir un cours…</option>
                      {favoriteOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Nom du cours
                  </label>
                  <input
                    type="text"
                    value={sessionSubject}
                    onChange={(e) => setSessionSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus={favoriteOptions.length === 0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubjectSubmit();
                    }}
                  />
                </div>

                <button
                  onClick={handleSubjectSubmit}
                  className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {showSessionTypeModal &&
        createPortal(
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
