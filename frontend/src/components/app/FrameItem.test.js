import React from 'react';
import FrameItem from './FrameItem';
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

it('renders an image', () => {
  const frameItem = shallow(<FrameItem item={item} />);
  expect(frameItem.find('img')).toHaveLength(1);
});

it('calls onClick callback when clicked', () => {
  const callback = jest.fn();
  const frameItem = shallow(<FrameItem item={item} onClick={callback} />);
  frameItem.simulate('click');
  expect(callback).toHaveBeenCalled();
});
