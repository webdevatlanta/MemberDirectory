import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {act} from 'react-dom/test-utils';
import Config from './config.test.json';

it('renders without crashing', async () => {
  fetch.resetMocks();

  const mockResponse = {
    "sha":"abc123",
    "content":btoa(JSON.stringify(MOCK_DIRECTORY))
  }

  fetch.mockResponseOnce(JSON.stringify(mockResponse));
  fetch.mockResponseOnce( JSON.stringify(MOCK_FOO_PROFILE) );
  fetch.mockResponseOnce( JSON.stringify(MOCK_BAR_PROFILE) );

  const div = document.createElement('div');

  await act( async () => {
    ReactDOM.render(<App config={Config} />, div);
  });

  ReactDOM.unmountComponentAtNode(div);
});
