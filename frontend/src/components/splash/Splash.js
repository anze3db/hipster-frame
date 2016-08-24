import React, { Component } from 'react';

class Splash extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Splash!</h2>
        </div>
        <p className="App-intro">
          <a href="/api/instagram/authorize">Authorize</a>
        </p>
      </div>
    );
  }
}

export default Splash;
