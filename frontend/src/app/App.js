import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppBar
          title="Hipster Frame"
          iconElementLeft={<IconButton iconClassName="material-icons">photo_camera</IconButton>}
          iconElementRight={
            <IconMenu
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              iconButtonElement={<IconButton
                iconClassName="material-icons">person</IconButton>}
            >
              <MenuItem primaryText="Sign out" href="/api/instagram/logout" />
            </IconMenu>
          }
        />
      </div>
    );
  }
}

export default App;
