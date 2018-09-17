import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyDG8zQdOft1RttyCNjZIdrB9ZSV4vdKPHk",
    authDomain: "recipes-cc787.firebaseapp.com",
    databaseURL: "https://recipes-cc787.firebaseio.com",
    projectId: "recipes-cc787",
    storageBucket: "recipes-cc787.appspot.com",
    messagingSenderId: "449581790487"
  };
  firebase.initializeApp(config);
export const auth = firebase.auth();
export const db = firebase.database();
export default firebase;