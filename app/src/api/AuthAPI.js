export function getAuthorization(config) {
  return new Promise((resolve, reject) => {
    fetch(config.server)
      .then(response => checkResponse(response))
      .catch(err => resolve({error:err}))
      .then(response => response.json())
      .catch(err => resolve({error:"auth response is invalid json"}, err))
      .then(({access_token, redirect}) =>  resolve({access_token, redirect}) )
      .catch(err => resolve({error:"failed to get authorization", err}))
  });
}

function checkResponse(response) {
  if (response.ok) {
    return response;
  } else {
    throw new Error(`${response.status}:${response.statusText}`);
  }
}
