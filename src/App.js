import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Chat from './components/Chat/Chat';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import UserCard from './components/UserCard/UserCard';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/chat/:chatId" component={Chat}/>
          <Route path="/NavBar" component={NavBar} />
          <Route path="/UserCard" component={UserCard} />
          <Route path="/" component={Home}/>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
