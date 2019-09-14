import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/styles';
import * as AuthAPI from '../api/AuthAPI';
import * as AdminAPI from '../api/AdminAPI';
import AdminMemberEditor from './AdminMemberEditor';

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
    async function applyEffect(memberlist) {
      if (authResult.access_token) {
        AdminAPI.get(memberlist)
          .then(response => JSON.parse(response.content) )
          .then(({members}) => setMembers(members) )
      } else {
        setMembers([]);
      }
    }

    applyEffect(memberlist)

  }, [authResult, memberlist])


  const onMemberEdited = (original, edited) => {
    const index = members.indexOf(original);
    const newMembers = [...members]
    newMembers[index] = edited;
    setMembers(newMembers);

    const token = authResult.access_token;
    AdminAPI.get(memberlist)
      .then(({sha}) => AdminAPI.put(memberlist, token, sha, JSON.stringify({members})))
  }

  return (
    <Container className={classes.grid} maxWidth="md">
      { authResult.access_token &&
        <Grid container className={classes.grid} spacing={10}>
        { members.map( (member, index) => (
          <AdminMemberEditor member={member} onMemberEdited={onMemberEdited} key={index.toString()}/>
        ))}
        </Grid>
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
