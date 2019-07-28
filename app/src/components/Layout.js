import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import BottomAppBar from './BottomAppBar';
import WebDevAtlantaLogo from '../assets/images/WDA-logo.png';
import Draggable from 'react-draggable';

const useStyles = makeStyles(theme => ({
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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  }
}));



export default function Layout(props) {
  const classes = useStyles();
  const [showName, setShowHideName] = useState(false);

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Grid container spacing={2} justify="center">
              <Grid item>
                <img id="logo" src={WebDevAtlantaLogo} alt="WebDevAtlanta primary logo" />
              </Grid>
              <Grid item>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                  Web Dev Atlanta is a meetup focused on web and software development. We meet and work on group projects and discuss topics in the area of web development. This group is open to all levels of coders!
            </Typography>
              </Grid>
            </Grid>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="secondary">
                    Join Us!
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div> {/* End hero unit */}

        <Container className={classes.cardGrid} maxWidth="md">
        
        <Grid 
          item
          style={{marginBottom: '10px'}}
        >
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => {setShowHideName(!showName)}}
          >
            {showName ? "Hide Name" : "Show Name"}
          </Button>
        </Grid>

          {/* Valid cards are show here */}
          <Grid container spacing={4}>
            {props.data.cards.filter(card => !card.error).map(card => (
              <Grid item key={card.name} xs={12} sm={6} md={4}>
                <Draggable
                  axis="both"
                  handle=".handle"
                  defaultPosition={{x: 0, y: 0}}
                  position={null}
                  grid={[25, 25]}
                  scale={1}
                >
                  <Card className={[classes.card, "handle"]} style={{cursor: 'grab'}}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={card.profile.avatar}
                      title="Member"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {showName ? card.name : ''}
                      </Typography>
                      <Typography>
                        {card.profile.status}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <a href={ card.github_url }>
                        <Button className={ classes.palette } size="small" color="primary" >
                          View
                        </Button>
                      </a>
                    </CardActions>
                  </Card>
                </Draggable>
              </Grid>
            ))}
          </Grid>
          

          {/* Cards with errors are shown here */}
          <Grid container spacing={4}>
            {props.data.cards.filter(card => !(!card.error)).map(card => (
              <Grid item key={card.name} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography>
                      <a href={card.gist_url}>{card.error.message}</a>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <BottomAppBar></BottomAppBar>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          &copy; WebDevAtlanta 2019
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          -social media here-
        </Typography>
      </footer>
      {/* End footer */}
    </React.Fragment >
  );
}
