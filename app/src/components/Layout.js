import React, {useState, useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';
import TopAppBar from './TopAppBar';
import GamePanel from './GamePanel';
import AdminPanel from './AdminPanel';
import HeroPanel from './HeroPanel';

function themedStyles(theme) {
  return {
    footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6),
    },
  };
}

function getModeFromUrlHash() {
  const hash = window.location.hash.split("#")[1];
  return hash ? hash : "hero";
}

const useStyles = makeStyles(themedStyles);

export default function({config}) {
  const classes = useStyles();
  const [mode, setMode] = useState( () => getModeFromUrlHash() );

  const getPanel = (mode, config) => {
    switch(mode) {
      case "game": return <GamePanel config={config}/>;
      case "admin": return <AdminPanel config={config}/>;
      default: return <HeroPanel config={config}/>;
    }
  }

  useEffect( () => {
    window.location.hash = `${mode}`;
  }, [mode])

  return (
    <>
      <CssBaseline />

      <TopAppBar mode={mode} setMode={setMode}/>

      <main>
        { getPanel(mode, config) }
      </main>

      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          &copy; WebDevAtlanta 2019
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p">
          -social media here-
        </Typography>
      </footer>

    </>
  );
}
