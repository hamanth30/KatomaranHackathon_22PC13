import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ChatWidget from './components/ChatWidget';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={ChatWidget} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;