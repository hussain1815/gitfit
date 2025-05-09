import { useEffect, useState } from 'react';
import { getLiveSessions } from '../services/live';
import auth from '@react-native-firebase/auth';

const useLiveSessions = (trainerId?: string) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const liveSessions = await getLiveSessions(trainerId);
      setSessions(liveSessions);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSessions();
    
    // Set up real-time listener
    const unsubscribe = auth().onAuthStateChanged(() => {
      refreshSessions();
    });

    return () => unsubscribe();
  }, [trainerId]);

  return { sessions, loading, error, refreshSessions };
};

export default useLiveSessions;