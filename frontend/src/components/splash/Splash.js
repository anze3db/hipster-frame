import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  parent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgb(25, 118, 210)'
  },
  main: {
    padding: '72px 24px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    color: 'white',
    textAlign: 'center'
  },
  logo: {
    fontSize: '200px'
  },
  h2: {
    fontWeight: 100,
    fontFamily: 'cursive'
  },
  button: {
    marginTop: '40px',
    fontVariant: 'small-caps',
    textTransform: 'inherit !important',
    color: 'red'
  }
};

class Splash extends Component {

  render() {
    return (
      <div className="App" style={styles.parent}>
        <div className="App-header" style={styles.main}>
          <div style={styles.logo} className="material-icons">photo_camera</div>
          <h1>Hipster Frame</h1>
          <h2 style={styles.h2}>Transform your instagram into a beautiful live picture frame</h2>
          <RaisedButton
            style={styles.button}
            backgroundColor="#BBDEFB"
            href="/api/instagram/authorize"
            label="Connect to Instagram"
          />
        </div>
      </div>
    );
  }
}

export default Splash;
