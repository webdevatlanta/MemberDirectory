import React, {useEffect, useState} from 'react';
import './App.css';
import Layout from './components/Layout';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import ProfileAPI from './api/ProfileAPI';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7091be',
    },
    secondary: {
      main: '#FFD700',
    }
  }
});

function App() {
  const [data, setData] = useState({ cards: [] });

  useEffect(() => {
    async function fetchData() {
      const cards = await ProfileAPI.fetchAll().catch(()=>{});
      setData({cards});
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Layout data={data}></Layout>
      </ThemeProvider>
    </div>
  );
}

export default App;
