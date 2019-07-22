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
    fetch(m.gist_url).then( (response) => {
      if (response.ok) {
        response.text().then( (gist_content) =>
          resolve({
            ...m,
            gist_content
          }))
      } else {
        resolve({
          ...m,
          github_url: "",
          avatar_url: "",
          gist_content: "(unreachable)"
        })
      }
    }).catch( (err) =>
      resolve({
        ...m,
        gist_content: "(fetch err)"
      }))
  });
}
