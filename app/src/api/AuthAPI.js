export function getAuthorization(server) {
  return new Promise((resolve, reject) => {
    fetch(server)
      .then(response => checkResponse(response))
      .then(response => response.json())
      .catch(error => resolve({error:"auth response is invalid json"}))
      .then(({access_token, redirect}) =>  resolve({access_token, redirect}) )
      .catch(error => resolve({error}));
  });
}

function checkResponse(response) {
  if (response.ok) {
    return response;
  } else {
    throw new Error(`${response.status}:${response.statusText}`);
  }
}
