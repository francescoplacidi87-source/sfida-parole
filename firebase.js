import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
  getFirestore,
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC2bwlk4KlCjdKzmMkGhF-ydNMGwK_C1Fw",
  authDomain: "sfida-parole.firebaseapp.com",
  projectId: "sfida-parole",
  storageBucket: "sfida-parole.firebasestorage.app",
  messagingSenderId: "786532097924",
  appId: "1:786532097924:web:b98f037451ebf165f987d1"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export {
  db,
  collection,
  getDocs,
  addDoc
};
