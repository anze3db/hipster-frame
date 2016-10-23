import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

class InstAppBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFullscreen: false
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
  }

  componentDidMount() {
    document.onwebkitfullscreenchange = this.changeFullscreen.bind(this);
  }

  componentWillUnmount() {
    document.onwebkitfullscreenchange = null;
  }

  render() {
    return (
      <AppBar
        title="Hipster Frame"
        iconElementLeft={<IconButton iconClassName="material-icons">photo_camera</IconButton>}
        iconElementRight={
          <div>
            <IconButton
              iconStyle={{color: "white"}}
              tooltip="Fullscreen"
              tooltipPosition="bottom-center"
              onClick={this.fullscreen.bind(this)}
              iconClassName="material-icons">{this.state.isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</IconButton>
            <IconMenu
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              iconButtonElement={<IconButton
                iconStyle={{color: "white"}}
                iconClassName="material-icons">person</IconButton>}
            >
              <MenuItem primaryText="Sign out" href="/api/instagram/logout" />
            </IconMenu>
          </div>
        }
      />
    );
  }
}

export default InstAppBar;
