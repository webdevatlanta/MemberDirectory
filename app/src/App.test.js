import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {act} from 'react-dom/test-utils';
import Config from './config.test.json';

it('renders without crashing', () => {
  fetch.resetMocks();

  /* Very hacky solution here; using a timeout to ensure all
   * the fetch mocks complete before the component unmounts. */

  let resolveMemberList;
  fetch.mockResponses(
    [
      () =>
        new Promise(resolve => {
          resolveMemberList = resolve;
        }),
    ],
    [TEST_MEMBER_1],
    [
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({body: TEST_MEMBER_2}), 0),
        ),
    ],
  );

  const div = document.createElement('div');

  act(() => {
    ReactDOM.render(<App config={Config} />, div);
  });

  act(() => {
    resolveMemberList({body: JSON.stringify(TEST_DIRECTORY)});
  });

  ReactDOM.unmountComponentAtNode(div);
});
