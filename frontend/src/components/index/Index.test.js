import React from 'react';
import { mount } from 'enzyme';
import Index from './Index';
import setupContext from '../setupMuiContext';

it('renders splash when cookie not set', () => {
  const index = mount(<Index />, setupContext(Index));
  expect(index.find('Splash')).toHaveLength(1);
});

it('renders app when cookie is set', () => {
  document.cookie = 'auth="2|1:0|10:1484779002|4:auth|4:MQ==|ca9461e7ceed3df3847988ac11ede777c635eec49fbef3eeb6d057df3e68f26f';
  const index = mount(<Index />, setupContext(Index));
  expect(index.find('App')).toHaveLength(1);
});
