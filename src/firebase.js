import firebase from 'firebase'

import 'firebase/firestore'


const config = {
    apiKey: "AIzaSyCyPf4bo26rb9dlKXb5Kb1X9gTZpE9v4PU",
    authDomain: "todos-fcc1f.firebaseapp.com",
    databaseURL: "https://todos-fcc1f.firebaseio.com",
    projectId: "todos-fcc1f",
    storageBucket: "todos-fcc1f.appspot.com",
    messagingSenderId: "817628579124"
  };

const firebaseApp = firebase.initializeApp(config);
const firestore = firebaseApp.firestore();
firestore.settings({timestampsInSnapshots:true});

export default firestore
