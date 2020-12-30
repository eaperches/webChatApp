import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Chat from './Chat'
import Home from './Home'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/chat/:chatId" component={Chat}/>
          <Route path="/" component={Home}/>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
