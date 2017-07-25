import PropTypes from 'prop-types';
import theme from '../theme.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

function setupContext(component) {
  component.contextTypes = {
    muiTheme: PropTypes.object
  };
  return {context: {muiTheme: theme}}
}

export default setupContext;
