import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Media from '../../stores/Media';

class MoreButton extends Component {
  render() {
    const style = {
      textAlign: 'center',
      margin: '20px'
    }
    return (
      <div style={style}>
        <FlatButton label="Load More" primary={true}
                    onClick={() => { Media.more() }}
                    disabled={Media.loading}>
        </FlatButton>
      </div>
    );
  }
}

export default MoreButton;
