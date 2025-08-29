import React, { useState, useEffect } from 'react';
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import './App.css';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import logo from './logo.svg';

const firebaseConfig = {
  // HINWEIS: Hier deine Firebase-Konfiguration einfügen.
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState("Laden...");

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data().exampleData);
        } else {
          setData("Keine Daten gefunden.");
          await setDoc(doc(db, "users", currentUser.uid), {
            exampleData: "Dies sind Beispieldaten."
          });
        }
      } else {
        signInAnonymously(auth);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Bund-Voting App</h1>
        <p>Willkommen zur interaktiven Plattform.</p>
        <div className="card">
          <p>
            Benutzer-ID: <code>{user ? user.uid : "Laden..."}</code>
          </p>
          <p>
            Daten: <code>{data}</code>
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
