import { Router, Route, browserHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue700, red700, grey600} from 'material-ui/styles/colors';
import App from './app/App';
import Splash from './splash/Splash';
import './index.css';

const auth = document.cookie.split('; ').map((c) => c.substring(0, c.indexOf('='))).indexOf('auth') > -1;

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: 'sans-serif',
  palette: {
    primary1Color: blue700,
    primary2Color: blue700,
    primary3Color: grey600,
    accent1Color: red700,
    accent2Color: red700,
    accent3Color: red700,
  },
  appBar: {
    height: 50,
  },
});

if (auth) {
  ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
        </Route>
      </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
  );
} else {
  ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={browserHistory}>
        <Route path="/" component={Splash}>
        </Route>
      </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
  );
}
