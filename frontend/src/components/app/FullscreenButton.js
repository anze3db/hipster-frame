import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';

class FullscreenButton extends Component {
  // TODO: Support non webkit browsers
  constructor(props) {
    super(props);
    this.state = {
      isFullscreen: document.webkitIsFullScreen
    }
  }
  fullscreen() {
    if (document.webkitIsFullScreen) {
      document.webkitCancelFullScreen();
    } else {
      document.documentElement.webkitRequestFullScreen();
    }
  }
  changeFullscreen() {
    this.setState({isFullscreen: document.webkitIsFullScreen});
    this.props.onFullScreenChange(document.webkitIsFullScreen);
  }
  componentDidMount() {
    document.onwebkitfullscreenchange = this.changeFullscreen.bind(this);
  }
  componentWillUnmount() {
    document.onwebkitfullscreenchange = null;
  }
  render() {
    return (
      <IconButton
        iconStyle={{color: "white"}}
        tooltip="Fullscreen"
        tooltipPosition="bottom-center"
        onClick={this.fullscreen.bind(this)}
        iconClassName="material-icons">
        {this.state.isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
      </IconButton>
    );
  }
}

export default FullscreenButton;
