import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBBtObCWj794A0RSDTq7ztLLilfDSflV-k",
  authDomain: "monad-verdict-app.firebaseapp.com",
  projectId: "monad-verdict-app",
  storageBucket: "monad-verdict-app.firebasestorage.app",
  messagingSenderId: "843095790410",
  appId: "1:843095790410:web:2649cdc260da53158ae7b3",
  measurementId: "G-WRRJ35JL61"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// anonim giriş (gizli, kullanıcının müdahalesine gerek yok)
signInAnonymously(auth).catch((error) => {
  console.error('Firebase Auth Error:', error);
});
