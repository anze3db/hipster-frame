import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import FullscreenButton from './FullscreenButton';
import RefreshButton from './RefreshButton';
import AppSettings from './AppSettings';

class InstAppBar extends Component {

  constructor() {
    super();
    this.state = {
      fullscreen: false
    };
  }

  fullscreenChange(isFullScreen) {
    this.setState({
      fullscreen: isFullScreen
    });
  }

  handleClose = () => {
    this.setState({open: false});
  }

  handleOpen = () => {
    this.setState({open: true});
  }

  render() {
    let styles = {};
    if (this.state.fullscreen) {
      styles = {
        display: 'none'
      };
    }
    return (
      <AppBar
        style={styles}
        title="Hipster Frame"
        iconElementLeft={<IconButton iconClassName="material-icons">photo_camera</IconButton>}
        iconElementRight={
          <div>
            <FullscreenButton
              onFullScreenChange={this.fullscreenChange.bind(this)}>
            </FullscreenButton>
            <RefreshButton></RefreshButton>
            <IconMenu
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              iconButtonElement={<IconButton
                iconStyle={{color: "white"}}
                iconClassName="material-icons">menu</IconButton>}
            >
              <MenuItem primaryText="Settings" leftIcon={<span className="material-icons">settings</span>} onTouchTap={this.handleOpen} />
              <MenuItem primaryText="Sign out" leftIcon={<span className="material-icons">person</span>} href="/api/instagram/logout" />
            </IconMenu>
            <AppSettings open={this.state.open} closeHandler={this.handleClose} />
          </div>
        }
      />
    );
  }
}

export default InstAppBar;
