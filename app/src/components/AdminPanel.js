import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import {makeStyles} from '@material-ui/styles';
import * as AuthAPI from '../api/AuthAPI';
import * as ProfileAPI from '../api/ProfileAPI';
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

export default function({auth, member_masterlist}) {
  const classes = useStyles();

  const [authResult, setAuthResult] = useState({})
  const [members, setMembers] = useState([])
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function getAuthorization(config) {
      const result = await AuthAPI.getAuthorization(config)
      setAuthResult(result)
      if (result.access_token) {
        const directory = await ProfileAPI.fetchDirectory(member_masterlist);
        const indexed = directory.members.map( (member, index) => {return {...member, index}} );
        setMembers(indexed);
      }
    }

    getAuthorization(auth);
  }, [auth, member_masterlist])

  useEffect(() => {
    console.log("Now editing:", editing);
  },[editing])

  const handleChange = (member, field) => event => {
    const index = members.indexOf(member);
    const newMember = {...member, [field]:event.target.value};
    const newMembers = [...members];
    newMembers[index] = newMember;
    setMembers(newMembers);
  }

  return (
    <Container className={classes.grid} maxWidth="md">
      { authResult.access_token &&
        <Grid container className={classes.grid} spacing={10}>
        { members.map( (member, index) => (
          <AdminMemberEditor member={member} onMemberEdited={handleChange} editing={member.index === editing} setEditing={setEditing} key={index.toString()}/>
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
