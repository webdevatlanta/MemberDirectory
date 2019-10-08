import React from 'react';
import ReactDOM from 'react-dom';
import HeroPanel from './HeroPanel.js';
import {act} from 'react-dom/test-utils';
import Config from '../config.test.json';

import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';

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

function queueBrokenMemberlistResponse() {
  const mockResponse = {
    "sha":"abc123",
    "content":btoa('invalid-json')
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

it('shows an error message is the memberlist is unparsable', async() => {
  const expectedFailureMessage = "The memberlist file contains invalid JSON.";

  fetch.resetMocks();
  queueBrokenMemberlistResponse();

  const div = document.createElement('div');

  await act(async () => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <HeroPanel config={Config}/>
      </ThemeProvider>, div);
  });

  expect(fetch.mock.calls.length).toEqual(1);
  expect(div.innerHTML).toMatch(new RegExp(expectedFailureMessage));
});

it('shows an error message if memberlist fetch failed', async () => {
  const expectedFailureMessage = "expected failure message";
  fetch.resetMocks();
  fetch.mockReject(new Error(expectedFailureMessage));

  const div = document.createElement('div');

  await act(async () => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <HeroPanel config={Config}/>
      </ThemeProvider>, div);
  });

  expect(fetch.mock.calls.length).toEqual(1);
  expect(div.innerHTML).toMatch(new RegExp(expectedFailureMessage));
});

it('renders without crashing', async () => {
  fetch.resetMocks();
  queueMemberlistResponse();

  const div = document.createElement('div');

  await act(async () => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <HeroPanel config={Config}/>
      </ThemeProvider>, div);
  });

  expect(fetch.mock.calls.length).toEqual(1);
});
