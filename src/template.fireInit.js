import * as firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "site.firebaseapp.com",
    databaseURL: "https://site.firebaseio.com",
    projectId: "site",
    storageBucket: "site.appspot.com",
    messagingSenderId: "123456789"
  };
  const fire = firebase.initializeApp(config);
  
  export default fire;
  
  //rename this file to fireInit.js