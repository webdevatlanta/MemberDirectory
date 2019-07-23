import * as api from './ProfileAPI_private.js'
import TestConfig from "../config.test.json"

const TestMember = {
  "name":"foo",
  "github_username":"bar",
  "gist_id":"abc123"
}

Object.freeze(TestMember);

it('assigns a valid profile gist url', () => {
  const expected = "https://gist.githubusercontent.com/bar/abc123/raw"
  expect(api.assignGistUrl(TestMember).gist_url).toEqual(expected);
});

it('assigns a valid github profile url', () => {
  const expected = "https://github.com/bar"
  expect(api.assignGithubUrl(TestMember).github_url).toEqual(expected);
});

it('assigns a valid avatar url', () => {
  const expected = "https://github.com/bar.png?size=140"
  expect(api.assignAvatarUrl(TestMember).avatar_url).toEqual(expected);
});

it('fetches content from gist url', () => {
  const m = api.assignGistUrl(TestMember)
	const expected = "gist content";

  fetch.resetMocks();
  fetch.mockResponseOnce(expected);

  return api.assignGistContent(m).then( m_out => {
		expect(fetch.mock.calls.length).toEqual(1);
		expect(fetch.mock.calls[0][0]).toEqual(m_out.gist_url);
		expect(m_out.gist_content).toEqual(expected);
  });

});

it('returns error for failed gist fetch', () => {
  const m = api.assignGistUrl(TestMember)
  const expected = new Error("An error, how... expected!")

  fetch.resetMocks();
  fetch.mockReject(expected)

  return api.assignGistContent(m).then( m_out => {
		expect(fetch.mock.calls.length).toEqual(1);
		expect(fetch.mock.calls[0][0]).toEqual(m_out.gist_url);
		expect(m_out.error).toEqual(expected);
  });
});

it('fetches memberlist', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(TEST_MEMBERLIST));

  return api.fetchMemberList(TestConfig).then( (response) => {
		expect(fetch.mock.calls.length).toEqual(1);
		expect(response.members.length).toEqual(TEST_MEMBERLIST.members.length);
  });
});
