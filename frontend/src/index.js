import { Router, Route, browserHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './components/app/App';
import Splash from './components/splash/Splash';
import theme from './theme.js';
import './index.css';

const auth = document.cookie.split('; ').map((c) => c.substring(0, c.indexOf('='))).indexOf('auth') > -1;

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();



if (auth) {
  ReactDOM.render(
    <MuiThemeProvider muiTheme={theme}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
        </Route>
      </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
  );
} else {
  ReactDOM.render(
    <MuiThemeProvider muiTheme={theme}>
      <Router history={browserHistory}>
        <Route path="/" component={Splash}>
        </Route>
      </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
  );
}
