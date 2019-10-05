import * as api from './AdminAPI.js';
import TestConfig from '../config.test.json';

beforeEach(() => {
  fetch.resetMocks();
});

const expected_agent = "WebDevAtlanta GitHub API Interface/1.0"

it('Makes well formed GET request for memberlist', () => {
  const expectedContents = {
    members:[]
  }

  const mockResponse = {
    "sha":"abc123",
    "content":btoa(JSON.stringify(expectedContents))
  }

  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const config = TestConfig.data.memberlist;
  const {owner, repo, path, branch} = config;

  const expected_url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

  return api.get(TestConfig.data.memberlist).then(response => {
    expect(fetch.mock.calls.length).toEqual(1);
    const req = fetch.mock.calls[0][0];
    expect(req.method).toEqual("GET");
    expect(req.agent).toEqual(expected_agent);
    expect(req.url).toEqual(expected_url);
    expect(JSON.parse(response.content)).toEqual(expectedContents)
    expect(response.sha).toEqual("abc123");
  })
})

it('Makes a well formed PUT request for memberlist', () => {
  fetch.mockResponseOnce(`{"sha":"current-memberlist-sha"}`);

  const token = "abc123"
  const sha = "def456"
  const content = "hi"
  const config = TestConfig.data.memberlist;
  const {owner, repo, path, branch} = config;
  const expected_url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  return api.put(TestConfig.data.memberlist, token, sha, content).then(response => {
    expect(fetch.mock.calls.length).toEqual(1);
    const req = fetch.mock.calls[0][0];
    expect(req.method).toEqual("PUT");
    expect(req.agent).toEqual(expected_agent);
    expect(req.headers.get("Authorization")).toEqual(`token ${token}`);
    expect(req.url).toEqual(expected_url);
    const body = JSON.parse(req.body);
    expect(body.sha).toEqual(sha);
    expect(body.content).toEqual(btoa(content));
    expect(body.branch).toEqual(branch);

  })
})
