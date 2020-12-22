import React, { useRef, useState, useEffect, componentDidMount } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

/*icons*/
import { IoMdSend } from "react-icons/io";
import userIcon from "./img/user.png"

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
}else {
  firebase.app();
}



const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️</h1>
        <SignOut />
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

  const attentionSeeker = useRef("attentionSeeker");

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState(''); //useState hook is used to give states to functional components. In class components this is not needed.

  const sendMessage = async(e) => { //async functions allow us to use "await"

    e.preventDefault(); //prevents page from reloading when form is submitted

    const { displayName, uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      name: displayName,
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    })

    setFormValue('');

    attentionSeeker.current.scrollIntoView({ behavior: "smooth"});

  }


  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={attentionSeeker}></div>
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} placeholder="Enter Message" onChange={(e) => setFormValue(e.target.value)}/>

        <button type="submit" disabled={!formValue}><IoMdSend /></button>



      </form>
    </>
  )
}

function ChatMessage(props){
  const { name, text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
      <div className={`message ${messageClass}`}>
        <span>{name}</span>
      </div>
      
      <div className={`message ${messageClass}`}>
        <img src={ photoURL || userIcon } />
        <p>{text}</p>
      </div>
    </>)
}

export default App;
