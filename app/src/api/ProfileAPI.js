export function assignGistUrl(m) {
  const gist_server = 'https://gist.githubusercontent.com';
  return {
    ...m,
    gist_url: `${gist_server}/${m.github_username}/${m.gist_id}/raw`,
  };
}

export function assignGithubUrl(m) {
  return {
    ...m,
    github_url: `https://github.com/${m.github_username}`,
  };
}

export function assignAvatar(member, profile) {
  if (profile.avatar) {
    return profile;
  } else {
    return {
      ...profile,
      avatar: `https://github.com/${member.github_username}.png?size=460`,
    };
  }
}

export function assignProfile(m) {
  return new Promise((resolve) => {
    const fetchResponse = fetch(m.gist_url);

    if (!fetchResponse) {
      const error = new Error(`fetch() returned undefined,
        did you add a mock response to the test?`)
      return resolve({...m, error});
    }

    fetchResponse
      .then(response => checkResponse(response))
      .then(response => extract(response))
      .then(profile => assignAvatar(m, profile))
      .then(profile => resolve({...m, profile}))
      .catch(error => resolve({...m, error}));
  });
}

export async function extract(response) {
  function extractText() {
    return new Promise((resolve, reject) =>
      response
        .clone()
        .text()
        .then(text => resolve({text}))
        .catch(error => resolve({text: error.message})),
    );
  }

  function extractJSON() {
    return new Promise((resolve, reject) =>
      response
        .clone()
        .json()
        .then(json => resolve({json}))
        .catch(error => resolve({json: undefined})),
    );
  }

  const {json} = await extractJSON();

  if (json) {
    return {
      avatar: json.avatar,
      status: json.status,
    };
  }

  const {text, error} = await extractText();

  if (!error) {
    return {
      avatar: undefined,
      status: text,
    };
  } else {
    return {
      avatar: undefined,
      status: error,
    };
  }
}

function checkResponse(response) {
  if (response.ok) {
    return response;
  } else {
    throw new Error(`${response.status}:${response.statusText}`);
  }
}
