import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Media from '../../stores/Media';

class RefreshButton extends Component {
  render() {
    return (
      <IconButton
        iconStyle={{color: "white", left: "0"}}
        onClick={() => { Media.fetch() }}
        iconClassName="material-icons">
        refresh
      </IconButton>
    );
  }
}

export default RefreshButton;
