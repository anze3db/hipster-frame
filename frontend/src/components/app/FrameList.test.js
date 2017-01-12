import React from 'react';
import FrameList from './FrameList';
import { shallow } from 'enzyme';
import sinon from 'sinon';

const item = {
  images: {
    standard_resolution: {}
  },
  user: {},
  caption: {
    text: 'Caption Text'
  }
};

const list = [
  Object.assign({id: 1}, item),
  Object.assign({id: 2}, item),
  Object.assign({id: 3}, item)
];

it('renders frameList without crashing', () => {
  const frameList = shallow(<FrameList list={list} />);
});

it('renders all the items', () => {
  const frameList = shallow(<FrameList list={list} />);
  expect(frameList.find('FrameItem')).toHaveLength(list.length);
});
