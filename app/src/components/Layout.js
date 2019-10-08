import React, {useState} from 'react';
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

const useStyles = makeStyles(themedStyles);

export default function({config}) {
  const classes = useStyles();
  const [mode, setMode] = useState({admin:false,game:false});

  return (
    <>
      <CssBaseline />
      <TopAppBar mode={mode} setMode={setMode}/>
      <main>
        {
          mode.game && <GamePanel config={config} />
        }

        {
          mode.admin && <AdminPanel config={config}/>
        }

        {
          (!mode.admin && !mode.game) && <HeroPanel config={config}/>
        }
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
