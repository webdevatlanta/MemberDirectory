import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/styles';
import * as AuthAPI from '../api/AuthAPI';
import * as AdminAPI from '../api/AdminAPI';
import AdminMemberEditor from './AdminMemberEditor';
import AdminMemberCreator from './AdminMemberCreator';

function themedStyles(theme) {
  return {
    grid: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(1),
    },
  }
}

const useStyles = makeStyles(themedStyles);

export default function({auth, memberlist}) {
  const classes = useStyles();

  const [authResult, setAuthResult] = useState({})
  const [members, setMembers] = useState([])

  useEffect(() => {
    async function applyEffect(config) {
      const result = await AuthAPI.getAuthorization(config)
      setAuthResult(result)
    }

     applyEffect(auth);
  }, [auth])

  useEffect(() => {
    async function effect(memberlist) {
      if (authResult.access_token) {
        AdminAPI.get(memberlist)
          .then(response => JSON.parse(response.content) )
          .then(({members}) => setMembers(members) )
          .catch(err => console.log("Error:", err))
      } else {
        setMembers([]);
      }
    }

    effect(memberlist)

  }, [authResult, memberlist])


  const onMemberEdited = (original, edited) => {
    const index = members.indexOf(original);
    const newMembers = [...members]
    newMembers[index] = edited;

    const token = authResult.access_token;
    const newContents = JSON.stringify({members:newMembers});
    AdminAPI.get(memberlist)
      .then(({sha}) => AdminAPI.put(memberlist, token, sha, newContents))
      .then((result) => setMembers(newMembers))
  }

  const onMemberCreated = (member) => {
    const newMembers = [...members, member];
    const token = authResult.access_token;
    const newContents = JSON.stringify({members:newMembers});
    AdminAPI.get(memberlist)
      .then(({sha}) => AdminAPI.put(memberlist, token, sha, newContents))
      .then((result) => setMembers(newMembers))
  }

  return (
    <Container className={classes.grid} maxWidth="md">
      { authResult.access_token &&
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Github Username</TableCell>
              <TableCell>Profile Gist ID</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          { members.map( (member, index) => ( <AdminMemberEditor member={member} onMemberEdited={onMemberEdited} key={index.toString()}/>))}
            <AdminMemberCreator onMemberCreated={onMemberCreated} key={-1}/>
          </TableBody>
        </Table>
      }
      { authResult.error &&
          <span>
            The auth middleware is not reachable. Is it running?
          </span>
      }
      { authResult.redirect &&
        <span>
          <Button
            variant="contained"
            color="secondary"
            href={`${authResult.redirect}`}>
            Login Using GitHub
          </Button>
        </span>
      }
    </Container>
  )
}
