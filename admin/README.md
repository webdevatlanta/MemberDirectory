# Admin Server
Barebones OAuth middleware for localhost. It follows the [Web Flow](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#web-application-flow) sequence to get an access token. The token is then cached and served to the MemberDirectory app.

## Client API
Request ```GET /token``` yields an access token, if available. Otherwise, redirect to the OAuth permissions page (GitHub) and, assuming the user grants permission, cache the resulting token and serve for subsequent ```GET /token``` requests.

## Install and Test
1) Clone this repo
2) ```make test```

## Configure for Use

1) Create a new Oauth application using https://github.com/settings/developers
2) Set the callback url to: _http://lvh.me:3001/auth-callback_
3) Copy the *client id* and *secret* into file called ```secrets/github-oauth.json```, like this:
```
{
    "REQUEST_CODE" : "https://github.com/login/oauth/authorize",
    "REQUEST_TOKEN": "https://github.com/login/oauth/access_token",
    "CLIENT_ID": "${client-id}",
    "CLIENT_SECRET": "${secret}",
    "AUTHORIZATION_GRANTED": "http://localhost:3000",
}
```

3) Start the server, ```make start```
