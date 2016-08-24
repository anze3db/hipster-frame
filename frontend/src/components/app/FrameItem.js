import React, { Component } from 'react';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';

class FrameList extends Component {
  render() {
    const item = this.props.item;
    return (
      <Card>
        <CardMedia>
          <img src={item.images.standard_resolution.url} alt="alt" />
        </CardMedia>
        <CardHeader
          title={item.user.full_name}
          subtitle={item.caption.text}
          avatar={item.user.profile_picture}
        />
      </Card>
    );
  }
}

export default FrameList;
