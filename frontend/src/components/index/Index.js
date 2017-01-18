import { Router, Route, browserHistory } from 'react-router'
import React from 'react';
import App from '../app/App';
import Splash from '../splash/Splash';

class Index extends React.Component {

  constructor() {
    super();
    this.state = {auth: document.cookie.split('; ').map((c) => c.substring(0, c.indexOf('='))).indexOf('auth') > -1};
  }

  render() {
    if (this.state.auth) {
      return <Router history={browserHistory}>
        <Route path="/" component={App}>
        </Route>
      </Router>
    } else {
      return <Router history={browserHistory}>
        <Route path="/" component={Splash}>
        </Route>
      </Router>
    }
  }
};

export default Index;
