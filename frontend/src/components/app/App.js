import React from 'react';
import {observer} from 'mobx-react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import AppBar from './AppBar';
import Frame from './Frame';
import Media from '../../stores/Media';



const App = observer(class App extends React.Component {

  componentDidMount() {
    Media.fetch();
  }

  render() {
    return (
      <div className="App">
        <AppBar />
        <Frame media={Media.list} />
        <RefreshIndicator
          size={50}
          left={window.innerWidth/2 - 25}
          top={2*50}
          status={Media.loading ? "loading" : "hide"}
          style={{
            display: 'inline-block',
            position: 'fixed',
          }}
        />
      </div>
    );
  }
});

export default App;
