import React, { useState } from 'react';
import Select from 'react-select'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import './Home.css';
import SignOut from './SignOut';
import SignIn from './SignIn';

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

function Home(props) {
  const [user] = useAuthState(auth);

  return (
    <div className="Home">
      <header>
        <h1>⚛️</h1>
        <SignOut />
      </header>

      <section>
        {user ? <Options/> : <SignIn />}
      </section>
    </div>
  );
}

function Options(props) {
  // Form values
  const [userAccess, setUserAccess] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');


  // Authentication for the current user.
  const { uid } = auth.currentUser;

  const memberRef = firestore.collection('members');
  const memberQuery = memberRef.where('userId', '==', uid)
    .where('status', '==', 1);
  const [memberAccess] = useCollectionData(memberQuery, {idField: 'id'});

  const options = memberAccess?.map((item) => {
    return {
      value: item.roomId,
      label: item.roomId // TODO: Add room name here.
    }
  });

  const submitAccessRequest = async(e) => { //async functions allow us to use "await"

    e.preventDefault(); //prevents page from reloading when form is submitted

    await memberRef.add({
      roomId: selectedRoom,
      userId: userAccess,
      status: 1,
    })
  }

  return (
    <>
      <p>Your user ID is: {uid}</p>
      <p>Grant room access to other users:</p>
      <Select options={options} onChange={(option) => setSelectedRoom(option)}/>
      <form onSubmit={submitAccessRequest}>
        <input value={userAccess} placeholder="Enter user ID to grant user access" onChange={(e) => setUserAccess(e.target.value)}/>
        <button type="submit" disabled={!selectedRoom || !userAccess}/>
      </form>
    </>
  )
}

export default Home;
