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
      <div style={styles.root}>
        <GridList
          cellHeight={160}
          cols={5}
          style={styles.gridList}
          >
          {this.props.list.map((item) =>
            <FrameItem item={item} key={item.id} onClick={() => this.props.onItemSelect(item)}/>
          )}
        </GridList>
      </div>
    );
  }
}

export default FrameList;
