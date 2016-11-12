import React, { Component } from 'react';
import FrameItem from './FrameItem';

class FrameList extends Component {
  render() {
    return (
      <div
        className="grid"
        >
        {this.props.list.map((item) =>
          <FrameItem item={item} key={item.id} onClick={() => this.props.onItemSelect(item)}/>
        )}
      </div>
    );
  }
}

export default FrameList;
