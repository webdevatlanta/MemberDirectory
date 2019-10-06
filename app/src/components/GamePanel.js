import React, {Component} from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import CardAPI from '../api/CardAPI';

class GamePanel extends Component {
  state = {
    showName: false,
    names: [],
    cards: [],
    score: 0,
  }

  constructor(props) {
    super(props);
    this.onNameChange = this.onNameChange.bind(this);
    this.onNameKeyDown = this.onNameKeyDown.bind(this);
  }

  setCards(cards) {
    this.setState({
      cards: [...cards],
      names: cards.map( (card) => Object.assign({name:undefined}) )
    });
  }

  componentDidMount() {
    return CardAPI.buildCards(this.props.config.data.memberlist)
      .then(CardAPI.randomizeOrder)
      .then(cards => this.setCards(cards))
      .catch(error => console.error(error));
  }

  /**
   * Handles the name change input event.
   * @param {Int} index The index of the array element for the name
   * @param {*} e The event from the name change.
   */
  onNameChange(index, e) {
    let namesArrayCopy = [...this.state.names];
    namesArrayCopy[index] = e.target.value;
    this.setState({names: namesArrayCopy});
  }

  /**
   * Enter key event hanlder for name input/guess of name.
   * @param {Int} index The index in the array of the name selected.
   * @param {*} e The event from the enter key press.
   */
  onNameKeyDown(index, e) {
    if (e.key === 'Enter') {
      let answer = this.state.cards[index].name.toUpperCase().split(' ')[0];
      let guess = e.target.value.toUpperCase().split(' ')[0];
      let guessResult = answer === guess;

      if (guessResult) {
        alert(`
        Your guess was: ${guess.charAt(0).toUpperCase() +
          guess.slice(1).toLowerCase()}.
        The answer is ${answer.charAt(0).toUpperCase() +
          answer.slice(1).toLowerCase()}.
        You got it right!
        `);
        this.setState({score: this.state.score + 1});
      } else {
        alert(`
        Your guess was: ${guess.charAt(0).toUpperCase() +
          guess.slice(1).toLowerCase()}.
        The answer is ${answer.charAt(0).toUpperCase() +
          answer.slice(1).toLowerCase()}.
        Sorry you got it wrong!
        `);
        this.setState({score: this.state.score - 1});
      }
    }
  }

  render() {
    const {classes} = this.props;
    return(
      <Container className={classes.cardGrid} maxWidth="md">
        <h2>Score: {this.state.score}</h2>

        <Grid item style={{marginBottom: '10px'}}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.setState({showName: !this.state.showName})}>
            {this.state.showName ? 'Hide Name' : 'Show Name'}
          </Button>
        </Grid>

        {/* Valid cards are show here */}
        <Grid container spacing={4}>
          {this.state.cards
            .filter(card => !card.error)
            .map((card, index) => (
              <Grid item key={card.name} xs={12} sm={6} md={4}>
                <Card className={classes.card} style={{cursor: 'grab'}}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={card.profile.avatar}
                    title="Member"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {this.state.showName ? (
                        card.name
                      ) : (
                        <input
                          type="text"
                          name={
                            card.github_username.toUpperCase() + '-' + index
                          }
                          data-id={index}
                          id={
                            card.github_username.toUpperCase() + '-' + index
                          }
                          value={this.state.names[index].name}
                          className="name"
                          onChange={e => this.onNameChange(index, e)}
                          onMouseDown={e => e.stopPropagation()}
                          onKeyDown={e => this.onNameKeyDown(index, e)}
                        />
                      )}
                    </Typography>
                    <Typography>{card.profile.status}</Typography>
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

        {/* Cards with errors are shown here */}
        <Grid container spacing={4}>
          {this.state.cards
            .filter(card => !!card.error)
            .map(card => (
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
      </Container>)
  }
}

const styles = theme => ({
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
});

export default withStyles(styles)(GamePanel);
