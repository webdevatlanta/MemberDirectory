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

