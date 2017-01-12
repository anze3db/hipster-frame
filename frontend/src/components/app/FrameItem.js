import React, { Component } from 'react';

class FrameItem extends Component {
  render() {
    const item = this.props.item;
    return (
      <div className="grid-item" key={item.images.standard_resolution.url} onClick={this.props.onClick}>
        <img style={{width: "100%", height: "100%"}} src={item.images.standard_resolution.url} role="presentation" />
      </div>
    );
  }
}

export default FrameItem;
