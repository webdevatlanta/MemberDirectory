import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';
import TopAppBar from './TopAppBar';
import CardGame from './CardGame';
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

export default function({cards, config}) {
  const classes = useStyles();
  const [mode, setMode] = useState({admin:false,game:false});

  return (
    <>
      <TopAppBar mode={mode} setMode={setMode}/>
      <CssBaseline />
      <main>
        {
          mode.game && <CardGame cards={cards} ></CardGame>
        }

        {
          mode.admin && <AdminPanel auth={config.auth} memberlist={config.data.memberlist}></AdminPanel>
        }

        {
          (!mode.admin && !mode.game) && <HeroPanel cards={cards}></HeroPanel>
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
