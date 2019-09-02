import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';
import * as AuthAPI from '../api/AuthAPI';

function themedStyles(theme) {
  return {
  }
}

const useStyles = makeStyles(themedStyles);

export default function({auth}) {
  const classes = useStyles();

  const [authResult, setAuthResult] = useState({})

  useEffect(() => {
    async function getAuthorization(server) {
      const result = await AuthAPI.getAuthorization(server)
      setAuthResult(result)
    }
    getAuthorization(auth.server);
  }, [auth])

  return (
    <Container maxWidth="md">
      { authResult.access_token ?
          <span>we have authorization</span>
          :
          <span>please authorize using OAuth
                <Button
                  variant="contained"
                  color="secondary"
                  href={`${authResult.redirect}`}
                  target="_window">
                  through GitHub.
                </Button>
        </span>
      }
    </Container>
  )
}
