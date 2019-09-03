# WebDevAtlanta Admin Middleware
This is a barebones OAuth middleware server, used by the MemberDirectory App's admin functionality.
This application runs on localhost, and obtains an OAuth access token from GitHub via the [Web Flow](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#web-application-flow) method.
It is written in Python.

# How does it work
A lightweight middleware server listens for a GET request at /request_authorization.
It replies with a redirect or an access_token, which is used by the front end app to interact with the MemberDirectory repository.
# Install and Test
1) Clone this repo
2) ```make test```

# Configure the Github OAuth App
1) Create an Oauth application using https://github.com/settings/developers
1) Set the callback field to: _http://lvh.me:3001/auth-callback_
2) Copy the client id and client secret, place them into file called ```secrets/github-oauth.json```, like this:
```
{
    "REQUEST_CODE" : "https://github.com/login/oauth/authorize",
    "REQUEST_TOKEN": "https://github.com/login/oauth/access_token",
    "CLIENT_ID": "client-id-here",
    "CLIENT_SECRET": "client-secret-here"
}
```
3) Start the middleware, ```make start```
