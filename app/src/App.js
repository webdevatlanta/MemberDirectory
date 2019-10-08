import React from 'react';
import Layout from './components/Layout';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import './App.css';

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
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Layout config={props.config} />
      </ThemeProvider>
    </div>
  );
}

export default App;
