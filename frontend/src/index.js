import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {useStrict} from 'mobx';
import theme from './theme.js';
import './index.css';
import Index from './components/index/Index';

useStrict(true);
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider muiTheme={theme}>
    <Index />
  </MuiThemeProvider>,
  document.getElementById('root') || document.createElement('div')
);
