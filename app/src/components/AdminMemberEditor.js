import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import {makeStyles} from '@material-ui/styles';

function themedStyles(theme) {
  return {
    card: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
    },
    activeCard: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'yellow',
    },
    formControl: {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(10),
    },
    saveButton: {
      margin: theme.spacing(3),
    },
    cancelButton: {
      margin: theme.spacing(3),
    }
  }
}

const useStyles = makeStyles(themedStyles);

export default function({member, onMemberEdited, editing, setEditing}) {
  const classes = useStyles();

  if (editing) {
  return (<Card className={classes.activeCard}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="edit_name">Name</InputLabel>
        <Input id="edit_name" value={member.name} onChange={onMemberEdited(member, 'name')} />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="edit_github_username">Github Username</InputLabel>
        <Input id="edit_github_username" value={member.github_username} onChange={onMemberEdited(member, 'github_username')} />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="edit_gist_id">Profile Gist Id</InputLabel>
        <Input id="edit_gist_id" value={member.gist_id} onChange={onMemberEdited(member, 'gist_id')} />
      </FormControl>
      <div>
        <Button variant="contained" color="primary" className={classes.saveButton}> save </Button>
        <Button variant="contained" color="primary" className={classes.cancelButton} onClick={ () => setEditing(false) }> cancel </Button>
      </div>
    </Card>)
  }
  else {
    return (<Card className={classes.card} onClick={ () => setEditing(member.index) }>
      <span>{member.name} (git:{member.github_username})</span>
      <small>{member.gist_id}</small>
    </Card>)
  }
}
