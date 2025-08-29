import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Define the global variables
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Check if Firebase is configured before initializing
const app = Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

const App = () => {
  const [user, setUser] = useState(null);
  const [votes, setVotes] = useState({});
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Function to show a temporary notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    if (!app) {
      showNotification('Firebase is not configured. Please ensure __firebase_config is available.', 'error');
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Authentication failed:", error);
          showNotification('Authentication failed. Please try again.', 'error');
        }
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!db || !user) return;

    const lawQuery = query(collection(db, `artifacts/${appId}/public/data/laws`));
    const unsubscribeLaws = onSnapshot(lawQuery, (querySnapshot) => {
      const lawsData = [];
      querySnapshot.forEach((doc) => {
        lawsData.push({ id: doc.id, ...doc.data() });
      });
      setLaws(lawsData);
    });

    const votesRef = doc(db, `artifacts/${appId}/users/${user.uid}/votes/user_votes`);
    const unsubscribeVotes = onSnapshot(votesRef, (docSnap) => {
      if (docSnap.exists()) {
        setVotes(docSnap.data().votes || {});
      }
    });

    return () => {
      unsubscribeLaws();
      unsubscribeVotes();
    };
  }, [db, user]);

  const handleVote = async (lawId, voteType) => {
    if (!user) {
      showNotification('You must be authenticated to vote.', 'error');
      return;
    }

    const voteRef = doc(db, `artifacts/${appId}/users/${user.uid}/votes/user_votes`);
    const lawRef = doc(db, `artifacts/${appId}/public/data/laws`, lawId);

    try {
      const newVotes = { ...votes, [lawId]: voteType };
      await setDoc(voteRef, { votes: newVotes }, { merge: true });

      const lawDoc = await getDocs(query(collection(db, `artifacts/${appId}/public/data/laws`), where('__name__', '==', lawId)));
      if (!lawDoc.empty) {
        const lawData = lawDoc.docs[0].data();
        let newTally = { ...lawData.tally };
        newTally[voteType] = (newTally[voteType] || 0) + 1;
        
        await setDoc(lawRef, { tally: newTally }, { merge: true });
        showNotification('Vote successfully cast!', 'success');
      } else {
        showNotification('Law not found.', 'error');
      }

    } catch (e) {
      console.error("Error casting vote: ", e);
      showNotification('Error casting vote.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin dark:border-gray-600"></div>
          <p className="mt-4 text-xl">App wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 flex flex-col items-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <div className="max-w-4xl w-full">
        <header className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">BundVoting</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Ein dezentrales Abstimmungssystem für Deutschland
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">User ID:</span>
            <span className="break-all text-xs font-mono text-gray-500 dark:text-gray-400">{user?.uid || 'Nicht authentifiziert'}</span>
          </div>
        </header>

        {notification.message && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${notification.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>
            {notification.message}
          </div>
        )}

        <main>
          <div className="grid gap-6 md:grid-cols-2">
            {laws.length > 0 ? (
              laws.map((law) => (
                <div key={law.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{law.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{law.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="text-green-500 font-bold mr-2">{law.tally?.pro || 0}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Ja-Stimmen</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 font-bold mr-2">{law.tally?.contra || 0}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Nein-Stimmen</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVote(law.id, 'pro')}
                      disabled={votes[law.id] === 'pro'}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        votes[law.id] === 'pro'
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                      }`}
                    >
                      Abstimmen (Ja)
                    </button>
                    <button
                      onClick={() => handleVote(law.id, 'contra')}
                      disabled={votes[law.id] === 'contra'}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        votes[law.id] === 'contra'
                          ? 'bg-red-500 text-white cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                      }`}
                    >
                      Abstimmen (Nein)
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
                Keine Gesetzesvorschläge verfügbar.
              </div>
            )}
          </div>
        </main>

        <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; 2025 BundVoting. Alle Rechte vorbehalten.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
