import React from 'react';
import {observer} from 'mobx-react';
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
        {Media.loading ? "Loading..." : <Frame media={Media.list} />}
      </div>
    );
  }
});

export default App;
