import React from 'react';
import { shallow } from 'enzyme';
import InstAppBar from './AppBar';

it('renders without styles', () => {
  const appbar = shallow(<InstAppBar />);
  expect(appbar.find('AppBar').first().props().style).toEqual({});
});

it('renders with styles', () => {
  const appbar = shallow(<InstAppBar />);
  appbar.instance().fullscreenChange(true);
  expect(appbar.find('AppBar').first().props().style).toEqual({
    display: 'none'
  });
});

it('handles open/close handlers', () => {
  const appbar = shallow(<InstAppBar />);
  appbar.instance().handleClose();
  expect(appbar.state('open': false));
  appbar.instance().handleOpen();
  expect(appbar.state('open': true));
});
