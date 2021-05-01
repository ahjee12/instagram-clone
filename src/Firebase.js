// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// import firebase from 'firebase';
// import auth from 'firebase/auth'
// import storage from 'firebase/storage'
// import db from 'firebase/firestore'

import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAm-9QoBMxN20qZMtzx_l3FOGznpzS_OG4",
  authDomain: "insta-c-caa97.firebaseapp.com",
  projectId: "insta-c-caa97",
  storageBucket: "insta-c-caa97.appspot.com",
  messagingSenderId: "576657615904",
  appId: "1:576657615904:web:7dfe2e7165c3cd24ed2045",
  measurementId: "G-0VBEHKCXDX"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

