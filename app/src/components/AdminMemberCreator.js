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
    },
  }
}

const useStyles = makeStyles(themedStyles);

export default function({onMemberCreated}) {
  const classes = useStyles();
  const blankMember = {
    name: "",
    github_username: "",
    gist_id: ""
  }

  const [editing, setEditing] = useState(false);
  const [changed, setChanged] = useState(blankMember);

  const handleChange = (field) => event => {
    const newMember = {...changed, [field]:event.target.value};
    setChanged(newMember)
  }

  const saveChange = () => {
    setEditing(false);
    onMemberCreated(changed);
  }

  const cancelChange = () => {
    setEditing(false);
    setChanged(blankMember);
  }

  if (editing) {
    return (
      <TableRow>
        <TableCell>
            <Input placeholder="name" onChange={handleChange('name')} />
        </TableCell>
        <TableCell>
            <Input placeholder="username" onChange={handleChange('github_username')} />
        </TableCell>
        <TableCell>
            <Input placeholder="gist id" onChange={handleChange('gist_id')} />
        </TableCell>
        <TableCell>
            <Button variant="contained" color="primary" className={classes.saveButton} onClick={saveChange}>add</Button>
            <Button variant="contained" color="primary" className={classes.cancelButton} onClick={cancelChange}>cancel</Button>
        </TableCell>
      </TableRow>
    )
  }
  else {
    return (
      <TableRow onClick={ () => setEditing(true) }>
        <TableCell>
          add new member
        </TableCell>
      </TableRow>
    )
  }
}
