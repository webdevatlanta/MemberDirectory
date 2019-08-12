import * as api from './ProfileAPI.js';
import TestConfig from '../config.test.json';

afterEach(() => {
  fetch.resetMocks();
});

it('assigns a valid profile gist url', () => {
  const expected = 'https://gist.githubusercontent.com/foofoo/123/raw';
  expect(api.assignGistUrl(TEST_MEMBER_FOO).gist_url).toEqual(expected);
});

it('assigns a valid github profile url', () => {
  const expected = 'https://github.com/foofoo';
  expect(api.assignGithubUrl(TEST_MEMBER_FOO).github_url).toEqual(expected);
});

it('profile assignment does 1 fetch from gist_url', () => {
  fetch.mockResponseOnce(TEST_FOO_PROFILE);

  const input = api.assignGistUrl(TEST_MEMBER_FOO);
  return api.assignProfile(input).then(output => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(output.gist_url);
  });
});

it('fetches profile as text and assigns default avatar', () => {
  fetch.mockResponseOnce(TEST_FOO_PROFILE);

  const avatar = `https://github.com/${TEST_MEMBER_FOO.github_username}.png?size=460`;
  const input = api.assignGistUrl(TEST_MEMBER_FOO);
  return api.assignProfile(input).then(output => {
    expect(output.profile.status).toEqual(TEST_FOO_PROFILE);
    expect(output.profile.avatar).toEqual(avatar);
  });
});

it('fetches profile as json and assigns default avatar', () => {
  fetch.mockResponseOnce(JSON.stringify(TEST_BAZ_PROFILE));

  const avatar = `https://github.com/${TEST_MEMBER_BAZ.github_username}.png?size=460`;
  const input = api.assignGistUrl(TEST_MEMBER_BAZ);
  return api.assignProfile(input).then(output => {
    expect(output.profile.status).toEqual(TEST_BAZ_PROFILE.status);
    expect(output.profile.avatar).toEqual(avatar);
  });
});

it('fetches profile as json with avatar specified', () => {
  fetch.mockResponseOnce(JSON.stringify(TEST_BAR_PROFILE));

  const input = api.assignGistUrl(TEST_MEMBER_FOO);
  return api.assignProfile(input).then(output => {
    expect(output.profile.status).toEqual(TEST_BAR_PROFILE.status);
    expect(output.profile.avatar).toEqual(TEST_BAR_PROFILE.avatar);
  });
});

it('builds profile using json gist', () => {
  const JSONString = JSON.stringify(TEST_BAR_PROFILE);
  fetch.mockResponseOnce(JSONString);

  return fetch('mocked-fetch-here')
    .then(response => api.extract(response))
    .then(profile => {
      expect(profile).toEqual(TEST_BAR_PROFILE);
    });
});

it('builds profile using text gist', () => {
  fetch.mockResponseOnce(TEST_FOO_PROFILE);

  return fetch('mocked-fetch-here')
    .then(response => api.extract(response))
    .then(profile => {
      expect(profile.status).toEqual(TEST_FOO_PROFILE);
    });
});

it('returns error for failed gist fetch', () => {
  const m = api.assignGistUrl(TEST_MEMBER_FOO);
  const expected = new Error('An error, how... expected!');

  fetch.mockReject(expected);

  return api.assignProfile(m).then(m_out => {
    expect(m_out.error).toEqual(expected);
  });
});

it('fetches memberlist', () => {
  fetch.mockResponseOnce(JSON.stringify(TEST_MEMBER_MASTERLIST));

  return api.fetchDirectory(TestConfig).then(directory => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(directory.members.length).toEqual(
      TEST_MEMBER_MASTERLIST.members.length,
    );
  });
});

it('returns error if memberlist fetch fails', () => {
  const expectedError = 'member directory is invalid json';
  fetch.mockReject(expectedError);

  return api.fetchDirectory(TestConfig).then(response => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(response.error).toEqual(expectedError);
  });
});

it('returns error for unparseable memberlist json', () => {
  fetch.mockResponseOnce(`{"this comma->","is bad."}`);

  return api.fetchDirectory(TestConfig).then(response => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(response.error).toBeTruthy();
  });
});
