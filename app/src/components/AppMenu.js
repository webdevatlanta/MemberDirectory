import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function({mode, setMode}) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleAdministrate = () => {
    setMode("admin");
    setAnchorEl(null);
  };

  const handleGame = () => {
    setMode("game");
    setAnchorEl(null);
  };

  const handleHero = () => {
    setMode("hero");
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        id="app-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleHero}>Hero</MenuItem>
        <MenuItem onClick={handleAdministrate}>Administrate</MenuItem>
        <MenuItem onClick={handleGame}>Game</MenuItem>
      </Menu>
    </>
  );
}
