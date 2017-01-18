import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../../theme.js';
import App from './App';
import { shallow } from 'enzyme';
// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';


beforeAll(() => {
  injectTapEventPlugin();
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
})

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MuiThemeProvider muiTheme={theme}>
      <App />
    </MuiThemeProvider>, div);
});

it('renders spinner, appbar & frame', () => {
  const app = shallow(<App />);
  expect(app.find('InstAppBar')).toHaveLength(1);
  expect(app.find('Frame')).toHaveLength(1);
  expect(app.find('RefreshIndicator')).toHaveLength(1);
});
