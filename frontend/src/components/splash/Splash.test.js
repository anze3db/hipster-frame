import React from 'react';
import { shallow, mount } from 'enzyme';
import Splash from './Splash';
import setupContext from '../setupMuiContext';

it('renders splash without crashing', () => {
  mount(<Splash />, setupContext(Splash));
});

it('should contain hipster-frame header', () => {
  const splash = shallow(<Splash />);
  expect(splash.contains(<h1>Hipster Frame</h1>)).toEqual(true);
});

it('should contain connect button', () => {
  const splash = shallow(<Splash />);
  expect(splash.find('RaisedButton')).toHaveLength(1);
});

it('should display the privacy url', () => {
  const splash = shallow(<Splash />);
  const links = splash.find('a');
  expect(links).toHaveLength(1);
  expect(links.node.props.href).toBe('/privacy')
});
