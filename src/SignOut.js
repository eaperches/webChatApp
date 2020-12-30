import firebase from 'firebase/app';
import 'firebase/auth';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBXhjWHf0Nq7-Ei5mxUSZ0iilsx43DQyeE",
    authDomain: "webchat-aaed6.firebaseapp.com",
    projectId: "webchat-aaed6",
    storageBucket: "webchat-aaed6.appspot.com",
    messagingSenderId: "508324246470",
    appId: "1:508324246470:web:b49eb6f7d75f561871b8c7",
    measurementId: "G-NB5MPG9FX0"
  });
} else {
  firebase.app();
}

const auth = firebase.auth();

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default SignOut;
