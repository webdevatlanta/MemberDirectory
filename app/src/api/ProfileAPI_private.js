export function fetchMemberList() {
  const gist_server = "https://gist.githubusercontent.com";
  const gist_user = "abrie";
  const gist_id = "f33af17591e8ab04458cd76b3764f222";
  const gist_url = `${gist_server}/${gist_user}/${gist_id}/raw/memberlist.js`;

  const checkResponse = (response) => {
    if (response.ok) return response;
    else throw new Error("Reponse errror");
  }

  return new Promise( (resolve, reject) => {
    fetch(gist_url)
      .then( (response) => checkResponse(response) )
      .then( (response) => response.json() )
      .then( (json) => resolve(json) )
      .catch( (err) => {
        resolve({error:err});
      })
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
      .then( (response) => {
        if (response.ok) return response.text()
        else throw new Error("Reponse errror");
      })
      .then( (gist_content) => {
        resolve({
          ...m,
          gist_content
        })
      })
      .catch( (err) => {
        resolve({
          ...m,
          github_url: "",
          avatar_url: "",
          gist_content: "(unreachable)"
        })
      })
  })
}
