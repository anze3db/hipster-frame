import React, { Component } from 'react';
import FrameItem from './FrameItem';

class FrameList extends Component {
  render() {
    return (
      <div>
        {this.props.list.map((item) =>
          <FrameItem item={item} key={item.id}/>
        )}
      </div>
    );
  }
}

export default FrameList;
