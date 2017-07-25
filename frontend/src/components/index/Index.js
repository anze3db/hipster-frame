import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React from 'react';
import App from '../app/App';
import Splash from '../splash/Splash';
import Privacy from '../privacy/Privacy';

class Index extends React.Component {

  constructor() {
    super();
    this.state = {auth: document.cookie.split('; ').map((c) => c.substring(0, c.indexOf('='))).indexOf('auth') > -1};
  }

  render() {
    if (this.state.auth) {
      return <BrowserRouter>
        <Switch>
          <Route path="/privacy" component={Privacy}></Route>
          <Route path="/" component={App}></Route>

        </Switch>
      </BrowserRouter>
    } else {
      return <BrowserRouter>
        <Switch>
          <Route path="/privacy" component={Privacy}></Route>
          <Route path="/" component={Splash}></Route>
        </Switch>
      </BrowserRouter>
    }
  }
};

export default Index;
