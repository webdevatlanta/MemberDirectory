import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppMenu from './AppMenu'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function TopAppBar({mode, setMode}) {
  const classes = useStyles();

  const [title, setTitle] = useState("")

  useEffect( () => {
    if (mode.admin) {
      setTitle("WebDevAtlanta: Admin Panel")
      return
    }

    if (mode.game) {
      setTitle("WebDevAtlanta: Let's play a game")
      return
    }

    setTitle("We welcome all!")
  }, [mode])

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <AppMenu mode={mode} setMode={setMode}/>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
