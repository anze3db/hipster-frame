import React from 'react';
import App from './App';
import { shallow, mount } from 'enzyme';
import setupContext from '../setupMuiContext';

beforeAll(() => {
  window.fetch = jest.fn(() => {
    // TODO Make this a bit nicer
    return Promise.resolve(new window.Response('[[1,2,3,{"id":1, "images": {"standard_resolution": {}}}]]', {
      status: 200,
      statusText: "OK",
      headers: {
        'Content-type': 'application/json'
      }
    }));
  });
});

it('renders without crashing', () => {
  mount(<App />, setupContext(App))
});

it('renders spinner, appbar & frame', () => {
  const app = shallow(<App />);
  expect(app.find('InstAppBar')).toHaveLength(1);
  expect(app.find('Frame')).toHaveLength(1);
  expect(app.find('RefreshIndicator')).toHaveLength(1);
});
