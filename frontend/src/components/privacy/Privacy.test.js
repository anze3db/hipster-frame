import React from 'react';
import { mount } from 'enzyme';
import Privacy from './Privacy';
import setupContext from '../setupMuiContext';

it('renders splash without crashing', () => {
  mount(<Privacy />, setupContext(Privacy));
});

it('check if it includes hipsterframe.com Privacy Policy', () => {
  const privacy = mount(<Privacy />, setupContext(Privacy));
  expect(privacy.text().indexOf('hipsterframe.com Privacy Policy')).toBe(0);
});
