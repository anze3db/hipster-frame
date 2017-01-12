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
  _getCaption() {
    if (!this.state.item || !this.state.item.caption) {
      return '';
    }
    return this.state.item.caption.text;
  }
  render() {
    const caption = this._getCaption();
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
          subtitle={caption}
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
