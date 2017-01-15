import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../../theme.js';
import Splash from './Splash';
import { shallow } from 'enzyme';

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

it('renders splash without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MuiThemeProvider muiTheme={theme}>
      <Splash />
    </MuiThemeProvider>, div);
});

it('should contain hipster-frame header', () => {
  const splash = shallow(<Splash />);
  expect(splash.contains(<h1>Hipster Frame</h1>)).toEqual(true);
});

it('should contain connect button', () => {
  const splash = shallow(<Splash />);
  expect(splash.find('RaisedButton')).toHaveLength(1);
});
