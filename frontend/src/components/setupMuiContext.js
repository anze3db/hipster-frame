import React from 'react';
import theme from '../theme.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

function setupContext(component) {
  component.contextTypes = {
    muiTheme: React.PropTypes.object
  };
  return {context: {muiTheme: theme}}
}

export default setupContext;
