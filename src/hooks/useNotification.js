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
    playSound('/notification.mp3');
  }, [playSound]);

  const notifyBreak = useCallback(() => {
    playSound('/break.mp3');
  }, [playSound]);
  const notifyContinueWork = useCallback(() => {
    playSound('/break.mp3');
  }, [playSound]);

  const notifyTakeBreak = useCallback(() => {
    playSound('/notification.mp3');
  }, [playSound]);

  return {
    notifySessionComplete,
    notifyBreak,
    notifyContinueWork,
    notifyTakeBreak,
    requestPermission
  };
};

export default useNotification;