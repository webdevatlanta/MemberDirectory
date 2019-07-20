import data from '../data/data.json';

export default {
  async fetchAll() {
    const members = data.members
      .map( assignGistUrl )
      .map( assignAvatarUrl )
      .map( assignGithubUrl );

    return Promise.all( members.map( assignGistContent ) );
  }
}

function assignGistUrl(m) {
  return {
    ...m,
    gist_url:`https://gist.githubusercontent.com/${m.github_username}/${m.gist_id}/raw`
  }
}

function assignGithubUrl(m) {
  return {
    ...m,
    github_url:`https://github.com/${m.github_username}`
  }
}

function assignAvatarUrl(m) {
  return {
    ...m,
    avatar_url:`https://github.com/${m.github_username}.png?size=140`
  }
}

function assignGistContent(m) {
  return new Promise( (resolve, reject) => {
    fetch(m.gist_url).then( (response) => {
      if (response.ok) {
        response.text().then( (gist_content) => resolve({...m, gist_content}) )
      } else {
        resolve({...m, github_url: "", avatar_url: "", gist_content: "(unreachable)"})
      }
    }).catch( (err) => resolve({...m, gist_content: "(fetch err)"}) )
  });
}
