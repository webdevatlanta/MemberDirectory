import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { act } from 'react-dom/test-utils';

it('renders without crashing', () => {
  fetch.resetMocks();

  let doResolve;
  fetch.mockResponse(() => {
    return new Promise( (resolve) => {
      doResolve = resolve;
    })
  });

  const div = document.createElement('div');
  act( () => { ReactDOM.render(<App />, div) } );
  act( () => { doResolve("gist contents here, same for all.") });
  ReactDOM.unmountComponentAtNode(div);
});
