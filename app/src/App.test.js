import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {act} from 'react-dom/test-utils';
import Config from './config.test.json';

it('renders without crashing', async () => {
  fetch.resetMocks();

  fetch.mockResponseOnce( JSON.stringify(MOCK_MEMBER_MASTERLIST) );
  fetch.mockResponseOnce( JSON.stringify(MOCK_FOO_PROFILE) );
  fetch.mockResponseOnce( JSON.stringify(MOCK_BAR_PROFILE) );

  const div = document.createElement('div');

  await act( async () => {
    ReactDOM.render(<App config={Config} />, div);
  });

  ReactDOM.unmountComponentAtNode(div);
});
