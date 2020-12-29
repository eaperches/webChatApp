import React, { useRef, useState } from 'react';
import './Chat.css';

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

function Chat(props) {
  const [user] = useAuthState(auth);

  // Get the current chat room ID from the url
  const {chatId} = props.match.params;
  return (
    <div className="Chat">
      <header>
        <h1>⚛️</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom chatId={chatId}/> : <SignIn />}
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

function ChatRoom(props) {

  // Authentication for the current user.
  const { displayName, uid, photoURL } = auth.currentUser;

  const attentionSeeker = useRef("attentionSeeker");

  const memberRef = firestore.collection('members');
  const memberQuery = memberRef.where('userId', '==', uid)
    .where('roomId', '==', props.chatId)
    .where('status', '==', 1);
  const [memberAccess] = useCollectionData(memberQuery, {idField: 'id'});

  const messagesRef = firestore.collection('messages');
  const messageQuery = messagesRef.where('chatId', '==', props.chatId).orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(messageQuery, {idField: 'id'});

  console.log(messages);

  const lastMessage = messages == null ? null : messages[messages.length - 1];

  const timeLimit = 5*60;

  const [formValue, setFormValue] = useState(''); //useState hook is used to give states to functional components. In class components this is not needed.

  const sendMessage = async(e) => { //async functions allow us to use "await"

    e.preventDefault(); //prevents page from reloading when form is submitted

    await messagesRef.add({
      chatId: props.chatId,
      name: lastMessage && (lastMessage.uid != uid || Date.now()/1000 - lastMessage.createdAt.seconds > timeLimit  )  ?  displayName : null,
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    })

    setFormValue('');

    attentionSeeker.current.scrollIntoView({ behavior: "smooth"});

  }


  return (
    <div>
      {memberAccess && memberAccess.length > 0 ? (
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
        ) : (

          <main>
            <h1>{memberAccess ? "You do not have access to this chat." : "Loading..."}</h1>
          </main>
        )}
    </div>
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
        <img alt={name} src={ photoURL || userIcon } />
        <p>{text}</p>
      </div>
    </>)
}

export default Chat;
