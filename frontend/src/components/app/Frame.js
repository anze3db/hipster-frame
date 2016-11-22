import React, { Component } from 'react';
import FrameList from './FrameList';
import {Card, CardHeader} from 'material-ui/Card';

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
      <div className="single-item-holder">
        <img
          className="single-item"
          src={this.state.item.images.standard_resolution.url}
          role="presentation"
          onClick={this.onItemDeselect.bind(this)} />
        <Card style={{textAlign: 'left'}}>
        <CardHeader
          title={this.state.item.user.full_name}
          subtitle={this.state.item.caption ? this.state.item.caption.text : ''}
          avatar={this.state.item.user.profile_picture}
        />
        </Card>
      </div> :
      <FrameList
        list={this.props.media}
        onItemSelect={this.onItemSelect.bind(this)} />
    );
  }
}

export default Frame;
