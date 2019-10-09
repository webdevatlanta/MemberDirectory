import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

function themedStyles(theme) {
  return {
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardMedia: {
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      flexGrow: 1,
    },
  }
}

const useStyles = makeStyles(themedStyles);

export default function({cards}) {
  const classes = useStyles();

  return (
    <Container className={classes.cardGrid} maxWidth="md">

      <Grid container spacing={4}>
        {cards
          .filter(card => !card.error)
          .map((card, index) => (
            <Grid item key={card.name} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card.profile.avatar}
                  title="Member"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    { card.name }
                  </Typography>
                  <Typography>
                    {card.profile.status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <a href={card.github_url}>
                    <Button
                      className={classes.palette}
                      size="small"
                      color="primary">
                      View
                    </Button>
                  </a>
                </CardActions>
              </Card>
            </Grid>
        ))}
      </Grid>

    </Container>
  )
}
