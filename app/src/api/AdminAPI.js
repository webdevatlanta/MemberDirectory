export function put(config, token, sha, content) {
  const {branch} = config
  const method = "PUT";
  const agent = "WebDevAtlanta GitHub API Interface/1.0";
  const url = buildGithubAPIUrl(config);
  const headers = buildHeaders(token);
  const body = buildBody({content, sha, branch});
  const request = new Request(url, {method, headers, body, agent, mode:'cors'});

  return new Promise((resolve, reject) => {
    fetch(request)
      .then(response => checkResponse(response))
      .catch(err => resolve({error:`${err}`}))
      .then(response => response.json())
      .catch(err => resolve({error:"API response to PUT is not json."}))
      .then(response =>  resolve({response}))
      .catch(err => resolve({error:"API PUT request failed.", err}))
  });
}

export function get(config) {
  const method = "GET";
  const agent = "WebDevAtlanta GitHub API Interface/1.0";
  const url = buildGithubAPIUrl(config);
  const params = buildGetParams(config);
  const request = new Request(`${url}?${params}`, {method, agent});

  return new Promise((resolve, reject) => {
    fetch(request)
      .then(response => checkResponse(response))
      .catch(err => resolve({error:`${err}`}))
      .then(response => response.json())
      .catch(err => resolve({error:"member directory is invalid json"}))
      .then(({sha, content}) =>  resolve({sha, content:atob(content)}))
      .catch(err => resolve({error:"Error from GET request to API endpoint", err}))
  });
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
    throw new Error(`${response.status} ${response.statusText}`);
  }
}