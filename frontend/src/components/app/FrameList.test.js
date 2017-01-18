import React from 'react';
import FrameList from './FrameList';
import { shallow, mount } from 'enzyme';

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
  shallow(<FrameList list={list} />);
});

it('renders all the items', () => {
  const frameList = shallow(<FrameList list={list} />);
  expect(frameList.find('FrameItem')).toHaveLength(list.length);
});

it('responds to item click', () => {
  const spy = jest.fn();
  const frameList = mount(<FrameList list={list} onItemSelect={spy}/>);
  const firstItem = frameList.find('FrameItem').first();
  firstItem.simulate('click');
  expect(spy).toHaveBeenCalled();
});
