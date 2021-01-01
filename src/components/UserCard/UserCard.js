import React from 'react';

import './UserCard.css';
import userImage from '../../img/user.png';

function UserCard(props)
{
    const {photoURL, name} = props;
    return (<>
        <div class='UserCard'>
            <img class='unselectable' src={photoURL ? photoURL : userImage}></img>
            <span class='unselectable'>{name}</span>
            
        </div>
    </>);
}



export default UserCard;