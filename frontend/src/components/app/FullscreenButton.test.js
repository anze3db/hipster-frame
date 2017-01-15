import React from 'react';
import FullscreenButton from './FullscreenButton';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import setupContext from '../setupMuiContext';

it('calls webkitRequestFullScreen on click', () => {
  const spy = document.documentElement.webkitRequestFullScreen = sinon.spy();
  const fullscreenButton = shallow(<FullscreenButton />);
  fullscreenButton.simulate('click');
  expect(spy.called).toBeTruthy();
});

it('calls webkitCancelFullScreen when in fullscreen', () => {
  const spy = document.webkitCancelFullScreen = sinon.spy();
  const fullscreenButton = shallow(<FullscreenButton />);
  document.webkitIsFullScreen = true;
  fullscreenButton.simulate('click');
  expect(spy.called).toBeTruthy();
});

it('mounts/unmounts onwebkitfullscreenchange correctly', () => {
  const fullscreenButton = mount(<FullscreenButton />, setupContext(FullscreenButton));
  expect(document.onwebkitfullscreenchange).toBeTruthy();
  fullscreenButton.unmount();
  expect(document.onwebkitfullscreenchange).toBeFalsy();
});

it('calls changeFullScreen callback on onwebkitfullscreenchange', () => {
  const spy = sinon.spy();
  const fullscreenButton = mount(<FullscreenButton onFullScreenChange = {spy} />, setupContext(FullscreenButton));
  document.onwebkitfullscreenchange();
  expect(spy.called).toBeTruthy();
})
