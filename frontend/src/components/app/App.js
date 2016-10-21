import React, { Component } from 'react';
import AppBar from './AppBar';
import FrameList from './FrameList';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      media: []
    };
  }

  componentDidMount() {
    this.request = fetch('/api/instagram/media', {
      credentials: 'same-origin'
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.error("Not OK");
      }
    }).then((response) => {
      return response.map((res) => res[4]); // 4th element is the image json
    }).then((media) => {
      this.setState({
        media
      })
    })
  }

  componentWillUnmount() {
    // Should abort the request here, but can't because ES2015 promises
    // can't be cancelled :(
  }

  render() {
    return (
      <div className="App">
        <AppBar />
        <FrameList list={this.state.media} />
      </div>
    );
  }
}

export default App;
