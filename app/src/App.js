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
        .then(cards => setData({cards}))
        .catch((error) => {
          console.error(error)
        });
    }
    buildCards(props.config);
  }, [props.config]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Layout data={data} />
      </ThemeProvider>
    </div>
  );
}

export default App;
