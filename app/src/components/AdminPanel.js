import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/styles';
import * as AuthAPI from '../api/AuthAPI';

function themedStyles(theme) {
  return {
  }
}

const useStyles = makeStyles(themedStyles);

export default function({auth}) {
  const classes = useStyles();

  const [token, setToken] = useState("");

  useEffect(() => {
    async function loadAuth() {
      AuthAPI.getAuthorization(auth)
        .then( response => console.log(response) );
    }
    loadAuth();
  }, [auth])

  return (
    <Container maxWidth="md">
      { auth.server }
    </Container>
  )
}
