import * as api from './ProfileAPI.js';
import TestConfig from '../config.test.json';

const TestMember = {
  name: 'foo',
  github_username: 'bar',
  gist_id: 'abc123',
};
Object.freeze(TestMember);

const TestMember_JSONProfile = {
  avatar: 'https://url/to/avatar',
  status: 'Hi, this is a json profile.',
};
Object.freeze(TestMember_JSONProfile);

const TestMember_JSONProfile_NoAvatar = {
  status: 'Hi, this is a json profile.',
};
Object.freeze(TestMember_JSONProfile_NoAvatar);

const TestMember_TextProfile = 'Hi, this is a text profile.';

it('assigns a valid profile gist url', () => {
  const expected = 'https://gist.githubusercontent.com/bar/abc123/raw';
  expect(api.assignGistUrl(TestMember).gist_url).toEqual(expected);
});

it('assigns a valid github profile url', () => {
  const expected = 'https://github.com/bar';
  expect(api.assignGithubUrl(TestMember).github_url).toEqual(expected);
});

it('profile assignment does 1 fetch from gist_url', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(TestMember_TextProfile);

  const input = api.assignGistUrl(TestMember);
  return api.assignProfile(input).then(output => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(output.gist_url);
  });
});

it('fetches profile as text and assigns default avatar', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(TestMember_TextProfile);

  const avatar = `https://github.com/${
    TestMember.github_username
  }.png?size=460`;
  const input = api.assignGistUrl(TestMember);
  return api.assignProfile(input).then(output => {
    expect(output.profile.status).toEqual(TestMember_TextProfile);
    expect(output.profile.avatar).toEqual(avatar);
  });
});

it('fetches profile as json and assigns default avatar', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(TestMember_JSONProfile_NoAvatar));

  const avatar = `https://github.com/${TestMember.github_username}.png?size=460`;
  const input = api.assignGistUrl(TestMember);
  return api.assignProfile(input).then(output => {
    expect(output.profile.status).toEqual(TestMember_JSONProfile.status);
    expect(output.profile.avatar).toEqual(avatar);
  });
});

it('fetches profile as json with avatar specified', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(TestMember_JSONProfile));

  const input = api.assignGistUrl(TestMember);
  return api.assignProfile(input).then(output => {
    expect(output.profile.status).toEqual(TestMember_JSONProfile.status);
    expect(output.profile.avatar).toEqual(TestMember_JSONProfile.avatar);
  });
});

it('builds profile using json gist', () => {
  fetch.resetMocks();

  const JSONString = JSON.stringify(TestMember_JSONProfile);
  fetch.mockResponseOnce(JSONString);

  return fetch('mocked-fetch-here')
    .then(response => api.extract(response))
    .then(profile => {
      expect(profile).toEqual(TestMember_JSONProfile);
    });
});

it('builds profile using text gist', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(TestMember_TextProfile);

  return fetch('mocked-fetch-here')
    .then(response => api.extract(response))
    .then(profile => {
      expect(profile.status).toEqual(TestMember_TextProfile);
    });
});

it('returns error for failed gist fetch', () => {
  const m = api.assignGistUrl(TestMember);
  const expected = new Error('An error, how... expected!');

  fetch.resetMocks();
  fetch.mockReject(expected);

  return api.assignProfile(m).then(m_out => {
    expect(m_out.error).toEqual(expected);
  });
});

it('fetches memberlist', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(TEST_DIRECTORY));

  return api.fetchDirectory(TestConfig).then(directory => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(directory.members.length).toEqual(TEST_DIRECTORY.members.length);
  });
});

it('returns error if memberlist fetch fails', () => {
  const expectedError = "member directory is invalid json";
  fetch.resetMocks();
  fetch.mockReject(expectedError);

  return api.fetchDirectory(TestConfig).then(response => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(response.error).toEqual(expectedError);
  });
});

it('returns error for unparseable memberlist json', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(`{"this comma->","is bad."}`);

  return api.fetchDirectory(TestConfig).then(response => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(response.error).toBeTruthy();
  });
});
