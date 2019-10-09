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

export default function({config}) {
  const classes = useStyles();

  const [auth, setAuth] = useState({})
  const [members, setMembers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function effect(config) {
      const result = await AuthAPI.getAuthorization(config)
      setAuth(result)
    }

     effect(config.auth);

  }, [config.auth])

  useEffect(() => {
    async function effect(resource) {
      await AdminAPI.get(resource)
        .then( (response) => JSON.parse(response.content) )
        .then( ({members}) => setMembers(members) )
        .catch( (error) => setError(error) )
    }

    if (auth.access_token) {
      effect(config.data.memberlist)
    } else {
        setMembers([]);
    }

  }, [auth, config.data.memberlist])


  const onMemberEdited = (original, edited) => {
    const index = members.indexOf(original);
    const newMembers = [...members]
    newMembers[index] = edited;

    const token = auth.access_token;
    const newContents = JSON.stringify({members:newMembers});

    AdminAPI.get(config.data.memberlist)
      .then( ({sha}) => AdminAPI.put(config.data.memberlist, token, sha, newContents) )
      .then( (result) => setMembers(newMembers) )
      .catch( (error) => setError(error) )
  }

  const onMemberCreated = (member) => {
    const newMembers = [...members, member];
    const token = auth.access_token;
    const newContents = JSON.stringify({members:newMembers});

    AdminAPI.get(config.data.memberlist)
      .then( ({sha}) => AdminAPI.put(config.data.memberlist, token, sha, newContents) )
      .then( (result) => setMembers(newMembers) )
      .catch( (error) => setError(error) )
  }

  const onMemberRemoved = (member) => {
    const newMembers = members.filter( (m) => m !== member );
    const token = auth.access_token;
    const newContents = JSON.stringify({members:newMembers});

    AdminAPI.get(config.data.memberlist)
      .then( ({sha}) => AdminAPI.put(config.data.memberlist, token, sha, newContents) )
      .then( (result) => setMembers(newMembers) )
      .catch( (error) => setError(error) )
  }

  return (
    <Container className={classes.grid} maxWidth="md">
      {
        error &&
          <>
            <hr></hr>
            <div> An Error Occurred </div>
            <div> {error.message} </div>
            <hr></hr>
          </>
      }
      { auth.access_token &&
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
          { members.map( (member, index) => ( <AdminMemberEditor member={member} onMemberEdited={onMemberEdited} onMemberRemoved={onMemberRemoved} key={index.toString()}/>))}
            <AdminMemberCreator onMemberCreated={onMemberCreated} key={-1}/>
          </TableBody>
        </Table>
      }
      { auth.error &&
          <span>
            The auth middleware is not reachable. Is it running?
          </span>
      }
      { auth.redirect &&
        <span>
          <Button
            variant="contained"
            color="secondary"
            href={`${auth.redirect}`}>
            Login Using GitHub
          </Button>
        </span>
      }
    </Container>
  )
}
