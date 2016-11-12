import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

class AppSettings extends Component {

  render() {
    const open = this.props.open || false;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.closeHandler}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={false}
        onTouchTap={this.props.closeHandler}
      />,
    ];
    return <Dialog
        actions={actions}
        title="Settings"
        modal={true}
        open={open}
      >
        <h4>Picture sources</h4>
        <Toggle
          label="Include your pictures"
          labelPosition="right"
          defaultToggled={true}
          style={{marginBottom: 16}}
        />
        <Toggle
          label="Include picture from people you follow"
          labelPosition="right"
          defaultToggled={false}
          style={{marginBottom: 16}}
        />
      </Dialog>
  }
}
export default AppSettings;
