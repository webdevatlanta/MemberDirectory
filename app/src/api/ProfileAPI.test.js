import * as api from './ProfileAPI.js';
import TestConfig from '../config.test.json';

beforeEach(() => {
  fetch.resetMocks();
});

it('assigns a valid profile gist url', () => {
  const expected = 'https://gist.githubusercontent.com/foofoo/123/raw';
  expect(api.assignGistUrl(MOCK_MEMBER_FOO).gist_url).toEqual(expected);
});

it('assigns a valid github profile url', () => {
  const expected = 'https://github.com/foofoo';
  expect(api.assignGithubUrl(MOCK_MEMBER_FOO).github_url).toEqual(expected);
});

it('profile assignment does 1 fetch from gist_url', () => {
  fetch.mockResponseOnce(MOCK_FOO_PROFILE);

  const input = api.assignGistUrl(MOCK_MEMBER_FOO);
  return api.assignProfile(input).then(output => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(output.gist_url);
  });
});

it('fetches profile as text and assigns default avatar', () => {
  fetch.mockResponseOnce(MOCK_FOO_PROFILE);

  const avatar = `https://github.com/${MOCK_MEMBER_FOO.github_username}.png?size=460`;
  const input = api.assignGistUrl(MOCK_MEMBER_FOO);
  return api.assignProfile(input).then(output => {
    expect(output.profile.status).toEqual(MOCK_FOO_PROFILE);
    expect(output.profile.avatar).toEqual(avatar);
  });
});

it('fetches profile as json and assigns default avatar', () => {
  fetch.mockResponseOnce(JSON.stringify(MOCK_BAZ_PROFILE));

  const avatar = `https://github.com/${MOCK_MEMBER_BAZ.github_username}.png?size=460`;
  const input = api.assignGistUrl(MOCK_MEMBER_BAZ);
  return api.assignProfile(input).then(output => {
    expect(output.profile.status).toEqual(MOCK_BAZ_PROFILE.status);
    expect(output.profile.avatar).toEqual(avatar);
  });
});

it('fetches profile as json with avatar specified', () => {
  fetch.mockResponseOnce(JSON.stringify(MOCK_BAR_PROFILE));

  const input = api.assignGistUrl(MOCK_MEMBER_FOO);
  return api.assignProfile(input).then(output => {
    expect(output.profile.status).toEqual(MOCK_BAR_PROFILE.status);
    expect(output.profile.avatar).toEqual(MOCK_BAR_PROFILE.avatar);
  });
});

it('builds profile using json gist', () => {
  const JSONString = JSON.stringify(MOCK_BAR_PROFILE);
  fetch.mockResponseOnce(JSONString);

  return fetch('mocked-fetch-here')
    .then(response => api.extract(response))
    .then(profile => {
      expect(profile).toEqual(MOCK_BAR_PROFILE);
    });
});

it('builds profile using text gist', () => {
  fetch.mockResponseOnce(MOCK_FOO_PROFILE);

  return fetch('mocked-fetch-here')
    .then(response => api.extract(response))
    .then(profile => {
      expect(profile.status).toEqual(MOCK_FOO_PROFILE);
    });
});

it('returns error for failed gist fetch', () => {
  const m = api.assignGistUrl(MOCK_MEMBER_FOO);
  const expected = new Error('An error, how... expected!');

  fetch.mockReject(expected);

  return api.assignProfile(m).then(m_out => {
    expect(m_out.error).toEqual(expected);
  });
});
