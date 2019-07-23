export function fetchMemberList(config) {
  const gist_server = config.gist_server;
  const gist_user = config.gist_user;
  const gist_id = config.gist_id;
  const gist_url = `${gist_server}/${gist_user}/${gist_id}/raw/memberlist.js`;

  return new Promise( (resolve, reject) => {
    fetch(gist_url)
      .then( (response) => checkResponse(response) )
      .then( (response) => response.json() )
      .then( (json) => resolve(json) )
      .catch( (err) => resolve({error:err}) )
  });
}

export function assignGistUrl(m) {
  const gist_server = "https://gist.githubusercontent.com"
  return {
    ...m,
    gist_url:`${gist_server}/${m.github_username}/${m.gist_id}/raw`
  }
}

export function assignGithubUrl(m) {
  return {
    ...m,
    github_url:`https://github.com/${m.github_username}`
  }
}

export function assignAvatarUrl(m) {
  return {
    ...m,
    avatar_url:`https://github.com/${m.github_username}.png?size=140`
  }
}

export function assignGistContent(m) {
  return new Promise( (resolve, reject) => {
    fetch(m.gist_url)
      .then( (response) => checkResponse(response) )
      .then( (response) => response.text() )
      .then( (gist_content) => resolve({ ...m, gist_content }) )
      .catch( (error) => resolve({ ...m, error }) )
  })
}

function checkResponse(response) {
  if (response.ok) {
    return response;
  } else {
    throw new Error(`${response.status}:${response.statusText}`);
  }
}

