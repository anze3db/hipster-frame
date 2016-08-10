import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue700, red700, grey600} from 'material-ui/styles/colors';

export default getMuiTheme({
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
