import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const auth = document.cookie.split('; ').map((c) => c.substring(0, c.indexOf('='))).indexOf('auth') > -1;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Hipster Frame 2!</h2>
        </div>
        <p className="App-intro">
          {auth && <a href="/api/instagram/logout">Logout</a>}
          {!auth && <a href="/api/instagram/authorize">Authorize</a>}
        </p>
      </div>
    );
  }
}

export default App;
