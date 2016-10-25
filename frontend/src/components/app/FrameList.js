import React, { Component } from 'react';
import FrameItem from './FrameItem';
import {GridList} from 'material-ui/GridList';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {

  },
};

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
