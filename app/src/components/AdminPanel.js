import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';
import * as AuthAPI from '../api/AuthAPI';
import * as ProfileAPI from '../api/ProfileAPI';

function themedStyles(theme) {
  return {
  }
}

const useStyles = makeStyles(themedStyles);

export default function({auth, member_masterlist}) {
  const classes = useStyles();

  const [authResult, setAuthResult] = useState({})
  const [members, setMembers] = useState([])

  useEffect(() => {
    async function getAuthorization(config) {
      const result = await AuthAPI.getAuthorization(config)
      console.log(result);
      setAuthResult(result)
      if (result.access_token) {
        const directory = await ProfileAPI.fetchDirectory(member_masterlist);
        setMembers(directory.members);
      }
    }

    getAuthorization(auth);
  }, [auth, member_masterlist])

  return (
    <Container maxWidth="md">
      { authResult.access_token &&
        <div>{members.map( (member, index) => (
          <div key={`${index}`}>
            <span>{member.name}</span>|
              <span>{member.github_username}</span>|
                <span>{member.gist_id}</span>
          </div>))}
        </div>
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
