import React, { Component } from 'react';
import {GridTile} from 'material-ui/GridList';

class FrameList extends Component {
  render() {
    const item = this.props.item;
    return (
      <GridTile
          key={item.images.standard_resolution.url}
        >
        <img src={item.images.standard_resolution.url} role="presentation" />
      </GridTile>
    );
  }
}

export default FrameList;
