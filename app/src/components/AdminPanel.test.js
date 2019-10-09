import React from 'react';
import ReactDOM from 'react-dom';
import AdminPanel from './AdminPanel';
import {act} from 'react-dom/test-utils';
import Config from '../config.test.json';

import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';

function queueAuthResponse() {
  const expected = {access_token:123}
  fetch.mockResponseOnce(JSON.stringify(expected));
}

function queueMemberlistResponse() {
  const expectedContents = {
    members:[]
  }

  const mockResponse = {
    "sha":"abc123",
    "content":btoa(JSON.stringify(expectedContents))
  }

  fetch.mockResponseOnce(JSON.stringify(mockResponse));
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7091be',
    },
    secondary: {
      main: '#FFD700',
    },
  },
});

it('Shows error message if authentication middleware unreachable.', async () => {
  fetch.resetMocks();
  fetch.mockReject( new Error("this is an expected error") );

  const div = document.createElement('div');

  await act(async () => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <AdminPanel config={Config}/>
      </ThemeProvider>, div);
  });

  expect(fetch.mock.calls.length).toEqual(1);
  expect(div.innerHTML).toMatch(new RegExp("The auth middleware is not reachable. Is it running\?"));
})

it('Requests authentication, then memberlist.', async () => {
  fetch.resetMocks();

  queueAuthResponse();
  queueMemberlistResponse();

  const div = document.createElement('div');

  await act(async () => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <AdminPanel config={Config}/>
      </ThemeProvider>, div);
  });

  expect(fetch.mock.calls.length).toEqual(2);
});
