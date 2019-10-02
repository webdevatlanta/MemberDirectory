import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import {makeStyles} from '@material-ui/styles';

function themedStyles(theme) {
  return {
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

export default function({member, onMemberEdited}) {
  const classes = useStyles();

  const [editing, setEditing] = useState(false);
  const [changed, setChanged] = useState(member);

  const handleChange = (field) => event => {
    const newMember = {...changed, [field]:event.target.value};
    setChanged(newMember)
  }

  const saveChange = () => {
    onMemberEdited(member, changed);
    setEditing(false);
  }

  const cancelChange = () => {
    setEditing(false);
    setChanged(member);
  }

  if (editing) {
  return (<Card className={classes.activeCard}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="edit_name">Name</InputLabel>
        <Input id="edit_name" value={changed.name} onChange={handleChange('name')} />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="edit_github_username">Github Username</InputLabel>
        <Input id="edit_github_username" value={changed.github_username} onChange={handleChange('github_username')} />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="edit_gist_id">Profile Gist Id</InputLabel>
        <Input id="edit_gist_id" value={changed.gist_id} onChange={handleChange('gist_id')} />
      </FormControl>
      <div>
        <Button variant="contained" color="primary" className={classes.saveButton} onClick={saveChange}> save </Button>
        <Button variant="contained" color="primary" className={classes.cancelButton} onClick={cancelChange}> cancel </Button>
      </div>
    </Card>)
  }
  else {
    return (<Card className={classes.card} onClick={ () => setEditing(true) }>
      <span>{member.name} (git:{member.github_username})</span>
      <small>{member.gist_id}</small>
    </Card>)
  }
}
