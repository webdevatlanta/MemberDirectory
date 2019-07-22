import * as api from './ProfileAPI_private.js'

it('assigns a valid profile gist url', () => {
  const m = {
    github_username: "foo",
    gist_id: "bar",
  }

  const url = "https://gist.githubusercontent.com/foo/bar/raw"
  expect(api.assignGistUrl(m).gist_url).toEqual(url);
});

it('assigns a valid github profile url', () => {
  const m = {
    github_username: "foo",
  }

  const url = "https://github.com/foo"
  expect(api.assignGithubUrl(m).github_url).toEqual(url);
});

it('assigns a valid avatar url', () => {
  const m = {
    github_username: "foo",
  }
  const url = "https://github.com/foo.png?size=140"
  expect(api.assignAvatarUrl(m).avatar_url).toEqual(url);
});

it('fetches content from gist url', () => {
	const expected = "this is mocked gist content";

  const m_in = {
    gist_url: "https://foo/bar/raw"
  }

  fetch.resetMocks();
  fetch.mockResponseOnce(expected);

  return api.assignGistContent(m_in).then( m_out => {
		expect(fetch.mock.calls.length).toEqual(1);
		expect(fetch.mock.calls[0][0]).toEqual(m_out.gist_url);
		expect(m_out.gist_content).toEqual(expected);
  });

});

it('cleanly handles rejected gist fetch', () => {
	const expected = "this is fetch should have failed ";

  const m_in = {
    gist_url: "https://foo/bar/raw"
  }

  fetch.resetMocks();
  fetch.mockReject(new Error('fake error message'))

  return api.assignGistContent(m_in).then( m_out => {
		expect(fetch.mock.calls.length).toEqual(1);
		expect(fetch.mock.calls[0][0]).toEqual(m_out.gist_url);
		expect(m_out.gist_content).toEqual("(unreachable)");
  });
});

it('fetches memberlist', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(TEST_MEMBERLIST));

  return api.fetchMemberList().then( (response) => {
		expect(fetch.mock.calls.length).toEqual(1);
		expect(response.members.length).toEqual(2);
  });
});
