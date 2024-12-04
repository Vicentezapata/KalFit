// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdWkf1RkFIvNOwqCpW89gUYDy6WcrZciw",
  authDomain: "kalfit-11989.firebaseapp.com",
  databaseURL: "https://kalfit-11989-default-rtdb.firebaseio.com",
  projectId: "kalfit-11989",
  storageBucket: "kalfit-11989.firebasestorage.app",
  messagingSenderId: "462971407969",
  appId: "1:462971407969:web:d032755065b31491872420",
  measurementId: "G-R6WCZ82D3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };