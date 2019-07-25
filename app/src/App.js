import React, {useEffect, useState} from 'react';
import './App.css';
import Layout from './components/Layout';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import ProfileAPI from './api/ProfileAPI';

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
    async function fetchData(config) {
      const cards = await ProfileAPI.fetchAll(config).catch(() => {});
      setData({cards});
    }
    fetchData(props.config);
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
