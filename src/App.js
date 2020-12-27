import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Chat from './Chat'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/chat/:chatId" component={Chat}/>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
