import React, {useEffect, useState} from 'react';
import './App.css';
import Layout from './components/Layout';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import CardAPI from './api/CardAPI';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7091be',
    },
    secondary: {
      main: '#FFD700',
    },
  },
});

function App(props) {
  const [data, setData] = useState({cards: []});

  useEffect(() => {
    async function buildCards(config) {
      const {member_masterlist} = config;
      await CardAPI.buildCards(member_masterlist)
        .then( CardAPI.randomizeOrder )
        .then(cards => setData({cards}))
        .catch((error) => {
          console.error(error)
        });
    }
    buildCards(props.config);
  }, [props.config]);

  if (data && data.cards && data.cards.length > 0) {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <Layout data={data} />
        </ThemeProvider>
      </div>
    );
  } else {
    return "Loading...";
  }
}

export default App;
