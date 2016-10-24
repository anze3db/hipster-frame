import React, { Component } from 'react';
import FrameList from './FrameList';

class Frame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: null
    };
  }
  onItemSelect(item) {
    this.setState({
      item
    });
  }
  onItemDeselect() {
    this.setState({
      item: null
    });
  }
  render() {
    return (
      this.state.item ?
      <img
        src={this.state.item.images.standard_resolution.url}
        role="presentation"
        onClick={this.onItemDeselect.bind(this)} /> :
      <FrameList
        list={this.props.media}
        onItemSelect={this.onItemSelect.bind(this)} />
    );
  }
}

export default Frame;
