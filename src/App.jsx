import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';

// Tailwind CSS wird als verfügbar angenommen.
// 'lucide-react' wird für Icons verwendet. Ich werde inline SVG-Icons nutzen, um den Code selbstständig zu machen.

// Globale Variablen für die Firebase-Konfiguration, die von der Umgebung bereitgestellt werden.
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Anbieter für die Authentifizierung
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Authentifizierungs-Status-Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    // Einmalige Anmeldung mit dem bereitgestellten Token
    const signInWithToken = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Anmeldung fehlgeschlagen:", e);
        setError("Anmeldung fehlgeschlagen. Versuche es später erneut.");
      }
    };
    
    signInWithToken();
    return () => unsubscribe();
  }, []);

  // Firestore-Daten-Listener
  useEffect(() => {
    if (!isAuthReady || !user) return;

    // Wir verwenden einen "public"-Pfad für gemeinsame Daten, wie in den Anweisungen beschrieben.
    const proposalsCollectionPath = `/artifacts/${appId}/public/data/proposals`;
    const q = collection(db, proposalsCollectionPath);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const proposalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Stellen Sie sicher, dass 'votes' ein Objekt ist, bevor Sie es verwenden
        votes: doc.data().votes || {},
      }));
      setProposals(proposalsData);
    }, (err) => {
      console.error("Fehler beim Abrufen der Vorschläge:", err);
      setError("Fehler beim Laden der Vorschläge.");
    });

    return () => unsubscribe();
  }, [isAuthReady, user]);

  // Funktion zum Anmelden mit Google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Fehler bei der Google-Anmeldung:", error);
      setError("Fehler bei der Anmeldung mit Google.");
    } finally {
      setLoading(false);
    }
  };

  // Funktion zum Anmelden mit GitHub
  const signInWithGithub = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("Fehler bei der GitHub-Anmeldung:", error);
      setError("Fehler bei der Anmeldung mit GitHub.");
    } finally {
      setLoading(false);
    }
  };

  // Funktion zum Abmelden
  const signOut = () => {
    auth.signOut();
    setUser(null);
  };

  // Funktion zum Abstimmen
  const handleVote = async (proposalId, voteType) => {
    if (!user) {
      setError("Bitte melde dich an, um abzustimmen.");
      return;
    }

    setLoading(true);
    try {
      const proposalRef = doc(db, `/artifacts/${appId}/public/data/proposals/${proposalId}`);
      
      // Firestore aktualisieren, um die Stimme des Benutzers zu speichern
      // Dies ist eine einfache Implementierung, die nicht sicher genug für eine echte Abstimmung wäre.
      // Eine echte App müsste eine serverseitige Validierung haben.
      await updateDoc(proposalRef, {
        [`votes.${user.uid}`]: voteType,
      });

    } catch (error) {
      console.error("Fehler bei der Abstimmung:", error);
      setError("Fehler beim Senden deiner Stimme.");
    } finally {
      setLoading(false);
    }
  };
  
  // Funktion zum Berechnen der Abstimmungsergebnisse
  const getVoteCounts = (votes) => {
    const counts = { pro: 0, contra: 0, neutral: 0 };
    if (!votes) return counts;
    Object.values(votes).forEach(vote => {
      if (vote === 'pro') counts.pro++;
      if (vote === 'contra') counts.contra++;
      if (vote === 'neutral') counts.neutral++;
    });
    return counts;
  };
  
  // Disclaimer-Modal für die rechtlichen Hinweise
  const DisclaimerModal = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 text-white rounded-2xl shadow-lg max-w-xl w-full p-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-400">Wichtiger Hinweis</h2>
        <p className="mb-4 text-sm leading-relaxed">
          Diese App ("Bund-Voting") ist ein reiner **technischer Prototyp** und **nicht** für den Einsatz in realen, politischen oder rechtlich bindenden Abstimmungsprozessen geeignet. Die in dieser App dargestellten Funktionalitäten dienen ausschließlich zu Demonstrationszwecken.
        </p>
        <p className="mb-4 text-sm leading-relaxed">
          Ein sicheres und rechtskonformes Abstimmungssystem müsste strenge Anforderungen an Identitätsprüfung, Verschlüsselung, Betrugsprävention und die Einhaltung komplexer Gesetze (wie dem EU AI Act, nationalen Wahlgesetzen und UN-Verordnungen) erfüllen. Diese App erfüllt diese Anforderungen **nicht**.
        </p>
        <p className="text-sm leading-relaxed">
          Die im Code verwendete Datenbank (Firestore) ist für dieses Demonstrationsszenario geeignet, bietet jedoch nicht die nötige Sicherheit für ein echtes politisches Abstimmungssystem.
        </p>
        <button
          onClick={() => setShowDisclaimer(false)}
          className="mt-6 w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Ich habe den Hinweis verstanden
        </button>
      </div>
    </div>
  );

  // Beispiel-Vorschläge (falls die Datenbank leer ist)
  const createInitialProposals = async () => {
    const proposalsRef = collection(db, `/artifacts/${appId}/public/data/proposals`);
    const initialData = [
      {
        title: "Gesetz zum Schutz digitaler Identitäten",
        description: "Ein Vorschlag zur Einführung neuer Sicherheitsstandards für digitale Identitäten von Bürgern.",
        votes: {}
      },
      {
        title: "Förderung von KI-Forschung in der Medizin",
        description: "Ein Plan zur Bereitstellung von Fördermitteln für Forschungsprojekte im Bereich der künstlichen Intelligenz in der medizinischen Diagnostik.",
        votes: {}
      }
    ];

    for (const proposal of initialData) {
      await setDoc(doc(proposalsRef, proposal.title.replace(/\s+/g, '-').toLowerCase()), proposal);
    }
  };

  // UI-Struktur der App
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-6 flex flex-col items-center">
      {showDisclaimer && <DisclaimerModal />}
      <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700">
        <header className="flex justify-between items-center mb-10 pb-4 border-b border-gray-700">
          <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">Bund-Voting</h1>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 hidden sm:inline">Angemeldet als: {user.uid}</span>
              <button
                onClick={signOut}
                className="py-2 px-6 bg-gray-700 text-sm font-semibold rounded-full shadow-md hover:bg-gray-600 transition-colors"
              >
                Abmelden
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="py-2 px-4 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="21.17" y1="8" x2="12" y2="12" />
                  <line x1="3.95" y1="6.06" x2="8.54" y2="14.86" />
                  <line x1="10.54" y1="14.86" x2="21.17" y2="8" />
                </svg>
                Google
              </button>
              <button
                onClick={signInWithGithub}
                disabled={loading}
                className="py-2 px-4 flex items-center bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="M9 19c-5 1.5-9-2.5-7-7 1.5-2.5 5.5-2 7.5-.5 2-1.5 6-1 9 2" />
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.86 8.16 6.84 9.49 1.15.22 1.57-.5 1.57-1.11v-2.09c-2.78.61-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.04-2.68-.1-.25-.45-1.27.1-2.66 0 0 .84-.27 2.75 1.02.79-.22 1.63-.33 2.47-.33.84 0 1.68.11 2.47.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.39.2 2.41.1 2.66.65.7 1.04 1.59 1.04 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.91.68 1.83v2.73c0 .61.41 1.34 1.57 1.11C19.14 20.16 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
          )}
        </header>

        {error && <div className="p-4 mb-6 bg-red-800 text-white rounded-xl text-center">{error}</div>}

        <main>
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">Aktuelle Abstimmungen</h2>
            <button
                onClick={createInitialProposals}
                className="py-2 px-4 bg-gray-700 text-sm font-semibold rounded-full shadow-md hover:bg-gray-600 transition-colors"
                title="Erstellt einige Beispiel-Abstimmungen in der Datenbank."
            >
                Beispiele erstellen
            </button>
          </div>
          <div className="grid gap-8">
            {proposals.length > 0 ? (
              proposals.map((proposal) => {
                const userVote = proposal.votes?.[user?.uid];
                const voteCounts = getVoteCounts(proposal.votes);
                return (
                  <div key={proposal.id} className="bg-gray-700 p-6 rounded-2xl shadow-lg border border-gray-600">
                    <h3 className="text-2xl font-bold mb-2 text-yellow-300">{proposal.title}</h3>
                    <p className="text-gray-300 mb-6">{proposal.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleVote(proposal.id, 'pro')}
                          disabled={!user || loading}
                          className={`py-2 px-5 font-semibold text-sm rounded-full transition-all duration-300 ${
                            userVote === 'pro'
                              ? 'bg-green-500 text-white shadow-xl scale-110'
                              : 'bg-green-600 hover:bg-green-700 text-white shadow-md disabled:bg-gray-600'
                          }`}
                        >
                          Zustimmen ({voteCounts.pro})
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, 'contra')}
                          disabled={!user || loading}
                          className={`py-2 px-5 font-semibold text-sm rounded-full transition-all duration-300 ${
                            userVote === 'contra'
                              ? 'bg-red-500 text-white shadow-xl scale-110'
                              : 'bg-red-600 hover:bg-red-700 text-white shadow-md disabled:bg-gray-600'
                          }`}
                        >
                          Ablehnen ({voteCounts.contra})
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, 'neutral')}
                          disabled={!user || loading}
                          className={`py-2 px-5 font-semibold text-sm rounded-full transition-all duration-300 ${
                            userVote === 'neutral'
                              ? 'bg-gray-400 text-gray-900 shadow-xl scale-110'
                              : 'bg-gray-500 hover:bg-gray-400 text-gray-900 shadow-md disabled:bg-gray-600'
                          }`}
                        >
                          Enthaltung ({voteCounts.neutral})
                        </button>
                      </div>
                      <div className="text-xs text-gray-400">
                        {userVote && (
                          <span className="font-semibold text-blue-300">
                            Deine Stimme: {userVote}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-10 bg-gray-700 rounded-2xl text-gray-400">
                Es gibt derzeit keine Abstimmungen. Klicke oben, um Beispiele zu erstellen.
              </div>
            )}
          </div>
        </main>
      </div>
      <div className="mt-8 text-center text-gray-500">
        <p className="text-sm">
          **Hinweis:** Die User-ID ist öffentlich sichtbar für kollaborative Zwecke.
        </p>
      </div>
    </div>
  );
}

export default App;
    
