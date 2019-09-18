import * as api from './AuthAPI.js';
import TestConfig from '../config.test.json';

beforeEach(() => {
  fetch.resetMocks();
});

it('returns error if network request fails.', () => {
  const expected = new Error("How expected!");
  fetch.mockReject(expected);
  return api.getAuthorization(TestConfig.auth).then(response => {
    expect(response.error).toEqual(expected);
  });
})

it('returns error if auth fetch gets malformed json.', () => {
  fetch.mockResponseOnce("badjsonhere");

  return api.getAuthorization(TestConfig.auth).then(response => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(TestConfig.auth.server);
    expect(response.error).toEqual("auth response is invalid json");
  });
});

it('returns fetch response as json if well formed.', () => {
  const expected = {access_token:123}
  fetch.mockResponseOnce(JSON.stringify(expected));

  return api.getAuthorization(TestConfig.auth).then(response => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(TestConfig.auth.server);
    expect(response).toEqual(expected);
  })
});
