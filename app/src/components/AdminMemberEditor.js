import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {makeStyles} from '@material-ui/styles';

function themedStyles(theme) {
  return {
    saveButton: {
      margin: theme.spacing(1),
    },
    cancelButton: {
      margin: theme.spacing(1),
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
    setEditing(false);
    onMemberEdited(member, changed);
  }

  const cancelChange = () => {
    setEditing(false);
    setChanged(member);
  }

  if (editing) {
    return (
      <TableRow>
        <TableCell>
            <Input value={changed.name} onChange={handleChange('name')} />
        </TableCell>
        <TableCell>
            <Input value={changed.github_username} onChange={handleChange('github_username')} />
        </TableCell>
        <TableCell>
            <Input value={changed.gist_id} onChange={handleChange('gist_id')} />
        </TableCell>
        <TableCell>
            <Button variant="contained" color="primary" className={classes.saveButton} onClick={saveChange}>save</Button>
            <Button variant="contained" color="primary" className={classes.cancelButton} onClick={cancelChange}>cancel</Button>
        </TableCell>
      </TableRow>
    )
  }
  else {
    return (
      <TableRow onClick={ () => setEditing(true) }>
        <TableCell>{member.name}</TableCell>
        <TableCell>{member.github_username}</TableCell>
        <TableCell>{member.gist_id}</TableCell>
        <TableCell></TableCell>
      </TableRow>
    )
  }
}
