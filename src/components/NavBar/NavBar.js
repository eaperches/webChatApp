import React from 'react';

import UserCard from '../UserCard/UserCard';

import './NavBar.css'

function NavBar (props) {
    return (<>
        <div class='NavBar'>
            <header>
                <h2 class='unselectable'>Chats</h2>
            </header>
            
            <UserCard name='Edgar Perches' / >
            <UserCard name='Ben Johnson' / >
        
        </div>
    </>)
}

export default NavBar;