export function put(config, token, sha, content) {
  const {branch} = config
  const method = "PUT";
  const agent = "WebDevAtlanta GitHub API Interface/1.0";
  const url = buildGithubAPIUrl(config);
  const headers = buildHeaders(token);
  const body = buildBody({content, sha, branch});
  const request = new Request(url, {method, headers, body, agent, mode:'cors'});

  return fetch(request)
    .then(response => checkResponse(response))
    .then(response => response.json())
    .then(response => Object.assign({response}))
}

export function get(config) {
  const method = "GET";
  const agent = "WebDevAtlanta GitHub API Interface/1.0";
  const url = buildGithubAPIUrl(config);
  const params = buildGetParams(config);
  const request = new Request(`${url}?${params}`, {method, agent});

  return fetch(request)
    .then(response => checkResponse(response))
    .then(response => response.json())
    .then(({sha, content}) => Object.assign({sha, content:atob(content)}))
}

export function getCurrentUser(token) {
  const method = "GET";
  const agent = "WebDevAtlanta GitHub API Interface/1.0";
  const url = `https://api.github.com/user`;
  const headers = buildHeaders(token);
  const request = new Request(url, {method, headers, agent});

  return fetch(request)
    .then(response => checkResponse(response))
    .then(response => response.json())
    .then(({login, message}) => Object.assign({login, message}))
}

function buildGithubAPIUrl(config) {
  const {owner, repo, path}  = config
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
}

function buildHeaders(token) {
  const headers = new Headers();
  headers.append("Authorization", `token ${token}`);
  headers.append("Content-Type", `application/json`);
  return headers;
}

function buildBody({content, sha, branch}) {
  return JSON.stringify({
    message: "Edited",
    content: btoa(content),
    sha,
    branch,
  });
}

function buildGetParams(config) {
  const params = new URLSearchParams();
  params.set("ref", config.branch);
  return params.toString();
}

function checkResponse(response) {
  if (response.ok) {
    return response;
  } else {
    throw Error(`${response.status} ${response.statusText}`);
  }
}
