import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBH6bPsAvqzG8s4eu-ApZdq-Y0vtNxna4s",
  authDomain: "game-6c547.firebaseapp.com",
  databaseURL: "https://game-6c547.firebaseio.com",
  projectId: "game-6c547",
  storageBucket: "game-6c547.appspot.com",
  messagingSenderId: "340286691944"
};

export const firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.database();
export const auth = firebaseApp.auth();