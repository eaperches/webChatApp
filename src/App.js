import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyBXhjWHf0Nq7-Ei5mxUSZ0iilsx43DQyeE",
  authDomain: "webchat-aaed6.firebaseapp.com",
  projectId: "webchat-aaed6",
  storageBucket: "webchat-aaed6.appspot.com",
  messagingSenderId: "508324246470",
  appId: "1:508324246470:web:b49eb6f7d75f561871b8c7",
  measurementId: "G-NB5MPG9FX0"
})



const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>

      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  return (
    <>
      <div>
        asd
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <div></div>
    </>
  )
}

function ChatMessage(props){
  const { text, uid } = props.message;

  return <p>{text}</p>
}

export default App;
