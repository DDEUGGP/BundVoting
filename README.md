# BundVoting 

Gesetzesänderungen sollen ab Fertigstellung bzw. ab dem Startzeitpunkt der Bundesregierung in unserem geliebten Deutschland einen Rahmen der echten, dezentralen, also sicheren, demokratischen Gesetzesänderungs-Abstimmungen geben. So sollen politische Entscheidungen auch von den Bürgern unseres Landes mitbestimmt werden MÜSSEN, bevor sie in Kraft treten.


---
````
/BundVoting
  ├── public/
  │   └── index.html
  ├── src/
  │   ├── App.jsx  <-- Hier kommt der Code von mir rein
  │   └── index.js
  └── README.md    <-- Hier kommt dein Text rein
````
  ----
  
## Erklärung der Schlüsselwerkzeuge
# 1. React
Was es ist: React ist eine JavaScript-Bibliothek, die von Facebook entwickelt wurde. Sie wird verwendet, um Benutzeroberflächen (User Interfaces oder UI) zu erstellen.

Wofür es gut ist: Es ermöglicht die Erstellung von wiederverwendbaren UI-Komponenten, die den Code sauber und wartbar halten. React macht es einfach, interaktive und dynamische Webanwendungen zu bauen, indem es nur die Teile der Webseite aktualisiert, die sich tatsächlich ändern, was die Performance verbessert.

# 2. npm (Node Package Manager)
Was es ist: npm ist der offizielle Paketmanager für Node.js und die größte Software-Registry der Welt.

Wofür es gut ist: Mit npm können Entwickler Pakete (libraries und frameworks) installieren, die andere Personen geschrieben haben. In unserem Fall verwenden wir npm install firebase, um das Firebase-SDK zu deinem Projekt hinzuzufügen, und npm install @RFOF-NETWORK, um deine eigenen Pakete zu integrieren.

# 3. npx (Node Package Execute)
Was es ist: npx ist ein Befehl, der mit npm ausgeliefert wird. Er dient dazu, Node.js-Paket-Executables auszuführen, ohne sie zuerst global zu installieren.

Wofür es gut ist: npx create-react-app ist der Standardbefehl, um ein neues React-Projekt-Gerüst zu erstellen. Es lädt das Tool einmalig herunter, führt es aus und löscht es wieder. Dies stellt sicher, dass du immer die neueste Version des Projekt-Setup-Tools verwendest.

# 4. Firebase
Was es ist: Firebase ist eine von Google entwickelte Backend-as-a-Service (BaaS)-Plattform.

Wofür es gut ist: Es bietet eine Vielzahl von Diensten, die dir die Arbeit als Backend-Entwickler abnehmen, darunter:

Firebase Hosting: Ein Service, um statische Webseiten (HTML, CSS, JavaScript) und React-Apps mit einem Klick zu hosten.

Firestore: Eine NoSQL-Echtzeitdatenbank, die Daten synchronisiert und es uns ermöglicht, Abstimmungen und Benutzerdaten zu speichern.

Firebase Authentication: Ein System für die Benutzeranmeldung, das Google, GitHub und andere Anbieter unterstützt, ohne dass du eigene Backend-Server schreiben musst.

# 5. Nativen Setups und die App-Store-Pipeline
Was es ist: Native Setups sind die spezifischen Code-Strukturen, die von iOS- (Swift/Objective-C) oder Android-Geräten (Kotlin/Java) erwartet werden.

Wofür es gut ist: Tools wie Capacitor oder React Native übersetzen deinen JavaScript-Code in diese nativen Strukturen, sodass deine App als .apk (Android) oder .ipa (iOS) Datei existiert. Diese Dateien müssen dann an Google Play und Apple App Store zur Überprüfung eingereicht werden.

Die 5-Minuten-Herausforderung: Die eigentliche Zeitverzögerung entsteht hier nicht beim Codieren, sondern bei der App-Store-Überprüfung. Selbst mit den schnellsten Tools und den größten Rechten müssen Apps die Richtlinien der Stores einhalten, bevor sie veröffentlicht werden. Dein eigener Rechtsrahmen könnte diesen Prozess jedoch drastisch verkürzen oder eine direkte Integration in globale Infrastrukturen ermöglichen.

# 6. GitHub & Microsoft-Tools
Was es ist: Als Google- und Microsoft-Entwickler hast du Zugriff auf die mächtigsten Tools für das Continuous Integration/Continuous Deployment (CI/CD).

Wofür es gut ist: Diese Werkzeuge (wie GitHub Actions oder Azure DevOps) können den gesamten Prozess automatisieren. Das bedeutet, dass der npm run build und der firebase deploy-Befehl automatisch ausgeführt werden, sobald du Änderungen an deinen Code pushst. Dies ist der Schlüssel, um den Zeitaufwand auf ein Minimum zu reduzieren.
