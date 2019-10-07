import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import WebDevAtlantaLogo from '../assets/images/WDA-logo.png';
import CardGrid from './CardGrid';
import CardAPI from '../api/CardAPI';

function themedStyles(theme) {
  return {
    heroContent: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
      marginTop: theme.spacing(4),
    },
  };
}

const useStyles = makeStyles(themedStyles);

export default function({config}) {
  const classes = useStyles();

  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function effect(memberlist) {
      await CardAPI.buildCards(memberlist)
        .then(CardAPI.randomizeOrder)
        .then(cards => setCards(cards))
        .catch(error => setError(error));
    }

    effect(config.data.memberlist);

  }, [config]);

  return (
    <>
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
      </div>{' '} {/* End hero unit */}

      {
        error &&
          <>
            <hr></hr>
            <div> Failed to load the member list. </div>
            <div> {error.message} </div>
            <hr></hr>
          </>
      }

      {
        cards.length > 0 &&
          <CardGrid cards={cards}></CardGrid>
      }
    </>
  );
}
