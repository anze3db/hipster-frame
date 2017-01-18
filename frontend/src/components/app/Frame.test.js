import React from 'react';
import Frame from './Frame';
import { shallow } from 'enzyme';

const item = {
  images: {
    standard_resolution: {}
  },
  user: {},
  caption: {
    text: 'Caption Text'
  }
};

const itemWithoutCaption = {
  images: {
    standard_resolution: {}
  },
  user: {},
};

function expectSingleItem(frame) {
  expect(frame.find('FrameList')).toHaveLength(0);
  expect(frame.find('img')).toHaveLength(1);
  expect(frame.find('Card')).toHaveLength(1);
  expect(frame.find('CardHeader')).toHaveLength(1);
}

function expectListOfItems(frame) {
  expect(frame.find('FrameList')).toHaveLength(1);
  expect(frame.find('img')).toHaveLength(0);
  expect(frame.find('Card')).toHaveLength(0);
  expect(frame.find('CardHeader')).toHaveLength(0);
}

it('renders FrameList when item not selected', () => {
  const frame = shallow(<Frame />);
  expectListOfItems(frame)
});

it('renders single frame when selected list when not', () => {
  const frame = shallow(<Frame />);
  frame.setState({item});
  expectSingleItem(frame);
  frame.setState({item: null});
  expectListOfItems(frame);
});

it('switches select', () => {
  const frame = shallow(<Frame />);
  frame.instance().onItemSelect(item);
  expect(frame.state('item')).toEqual(item);
});

it('switches deselect', () => {
  const frame = shallow(<Frame />);
  frame.setState({item});
  frame.instance().onItemDeselect();
  expect(frame.state('item')).toBeNull();
});

it('correctly handles item without caption', () => {
  const frame = shallow(<Frame />);
  frame.setState(itemWithoutCaption);
});
