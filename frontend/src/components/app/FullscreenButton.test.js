import React from 'react';
import FullscreenButton from './FullscreenButton';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

// TODO: See if I can avoid MuiThemeProvider things
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../../theme.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

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
  const fullscreenButton = mount(
    <MuiThemeProvider muiTheme={theme}>
      <FullscreenButton />
    </MuiThemeProvider>);
  expect(document.onwebkitfullscreenchange).toBeTruthy();
  fullscreenButton.unmount();
  expect(document.onwebkitfullscreenchange).toBeFalsy();
});

it('calls changeFullScreen callback on onwebkitfullscreenchange', () => {
  const spy = sinon.spy();
  const fullscreenButton = mount(
    <MuiThemeProvider muiTheme={theme}>
      <FullscreenButton onFullScreenChange = {spy}/>
    </MuiThemeProvider>);
  document.onwebkitfullscreenchange();
  expect(spy.called).toBeTruthy();
})
