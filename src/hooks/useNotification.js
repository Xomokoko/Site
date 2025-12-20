import { useCallback } from 'react';

const useNotification = () => {
  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  const playSound = useCallback((soundFile) => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = 0.5;
      audio.play().catch(err => {
        console.error('Erreur lecture audio:', err);
      });
    } catch (err) {
      console.error('Erreur création audio:', err);
    }
  }, []);

  const notifySessionComplete = useCallback(() => {
    playSound('/break.mp3');
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Session terminée', {
        body: 'Félicitations ! Prenez une pause bien méritée',
        icon: '/logo.png',
        silent: true
      });
    }
  }, [playSound]);

  const notifyBreak = useCallback(() => {
    playSound('/notification.mp3');
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pause terminée', {
        body: 'C\'est reparti pour une nouvelle session',
        icon: '/logo.png',
        silent: true
      });
    }
  }, [playSound]);

  return {
    notifySessionComplete,
    notifyBreak,
    requestPermission
  };
};

export default useNotification;