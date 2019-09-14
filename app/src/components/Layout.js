import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import TopAppBar from './TopAppBar';
import WebDevAtlantaLogo from '../assets/images/WDA-logo.png';
import CardGrid from './CardGrid';
import CardGame from './CardGame';
import AdminPanel from './AdminPanel';

function themedStyles(theme) {
  return {
    icon: {
      marginRight: theme.spacing(2),
    },
    heroContent: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
      marginTop: theme.spacing(4),
    },
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
      <TopAppBar />
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Grid container spacing={2} justify="center">
              <Grid item>
                <img
                  id="logo"
                  src={WebDevAtlantaLogo}
                  alt="WebDevAtlanta primary logo"
                />
              </Grid>
              <Grid item>
                <Typography
                  variant="h5"
                  align="center"
                  color="textSecondary"
                  paragraph>
                  Web Dev Atlanta is a meetup focused on web and software
                  development. We meet and work on group projects and discuss
                  topics in the area of web development. This group is open to
                  all levels of coders!
                </Typography>
              </Grid>
            </Grid>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    href="https://www.meetup.com/webdevatlanta/"
                    target="_window">
                    Join Us!
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>{' '}
        {/* End hero unit */}
        {
          mode.game && <>
            <Button
            variant="contained"
            color="secondary"
            onClick={ () => setMode({admin:false,game:false})}> Quit Game </Button>
            <CardGame cards={cards} ></CardGame>
          </>
        }

        {
          mode.admin && <>
            <Button
            variant="contained"
            color="secondary"
            onClick={ () => setMode({admin:false,game:false})}> Quit Admin </Button>
            <AdminPanel auth={config.auth} memberlist={config.data.memberlist}></AdminPanel>
          </>
        }

        {
          (!mode.admin && !mode.game) && <>
            <Button
              variant="contained"
              color="secondary"
              onClick={ () => setMode({admin:false,game:true})}> Play Game </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={ () => setMode({admin:true,game:false})}> Administrate </Button>
            <CardGrid cards={cards}></CardGrid>
          </>
        }
      </main>
      {/* Footer */}
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
      {/* End footer */}
    </>
  );
}
