import * as api from './ProfileAPI_private.js';
import TestConfig from '../config.test.json';

const TestMember = {
  name: 'foo',
  github_username: 'bar',
  gist_id: 'abc123',
};

Object.freeze(TestMember);

const TestMember_JSONProfile = {
  "avatar": "https://url/to/avatar",
  "text": "Hi, this is a json profile."
}

Object.freeze(TestMember_JSONProfile);

const TestMember_TextProfile = "Hi, this is a text profile."

it('assigns a valid profile gist url', () => {
  const expected = 'https://gist.githubusercontent.com/bar/abc123/raw';
  expect(api.assignGistUrl(TestMember).gist_url).toEqual(expected);
});

it('assigns a valid github profile url', () => {
  const expected = 'https://github.com/bar';
  expect(api.assignGithubUrl(TestMember).github_url).toEqual(expected);
});

it('assigns a valid avatar url', () => {
  const expected = 'https://github.com/bar.png?size=140';
  expect(api.assignAvatarUrl(TestMember).avatar_url).toEqual(expected);
});

it('fetches content as text from text gist url', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(TestMember_TextProfile);

  const input = api.assignGistUrl(TestMember);
  return api.assignGistContent(input).then(output => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(output.gist_url);
    expect(output.gist_content.text).toEqual(TestMember_TextProfile);
  });
});

it('extracts json from response if json', () => {
  fetch.resetMocks();

  const JSONString = JSON.stringify(TestMember_JSONProfile);
  fetch.mockResponseOnce(JSONString);

  return fetch("mocked-fetch-here")
    .then( (response) => api.extract(response) )
    .then( (result) => {
      expect(result.json).toEqual(TestMember_JSONProfile);
      expect(result.text).toEqual(JSONString)
    });
});

it('extracts text from response if not json', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(TestMember_TextProfile);

  return fetch("mocked-fetch-here")
    .then( (response) => api.extract(response) )
    .then( (result) => {
      expect(result.json).toEqual(undefined);
      expect(result.text).toEqual(TestMember_TextProfile);
    });
});

it('returns error for failed gist fetch', () => {
  const m = api.assignGistUrl(TestMember);
  const expected = new Error('An error, how... expected!');

  fetch.resetMocks();
  fetch.mockReject(expected);

  return api.assignGistContent(m).then(m_out => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(m_out.gist_url);
    expect(m_out.error).toEqual(expected);
  });
});

it('fetches memberlist', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(TEST_MEMBERLIST));

  return api.fetchMemberList(TestConfig).then(response => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(response.members.length).toEqual(TEST_MEMBERLIST.members.length);
  });
});
