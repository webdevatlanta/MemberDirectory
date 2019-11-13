# Admin Middleware Service
This is a required component for 'admin' functions provided by WebDevAtlanta Membership Directory app. This service is a lightweight, single user interface to the Github OAuth [web flow](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#web-application-flow). The Member Directory app needs this service in order to acquires a Github API token.

## Using this service
1) `make test`
2) `make start`

## But wait...
The above instructions only work if you've configured the service. The easiest way is to contact one of the admins and get the required configration file. The file lives in admin/secrets, and is not checked into the repository.

## Configuration
If this is a new installation, for a new organization, then you'll need to create a configuration file.
1) Create a new OAuth application using https://github.com/settings/developers
2) When creating the application, configure the callback url as: `http://lvh.me:3001/auth-callback`
3) Once the OAuth application has been created, create a file named  `admin/secrets/github-oauth.json`, like this:

    ```
    {
        "REQUEST_CODE" : "https://github.com/login/oauth/authorize",
        "REQUEST_TOKEN": "https://github.com/login/oauth/access_token",
        "CLIENT_ID": "your-oauth-app-client-id",
        "CLIENT_SECRET": "your-oath-app-secret",
        "AUTHORIZATION_GRANTED": "http://localhost:3000",
    }
    ```

    Note the `CLIENT_ID` and `CLIENT_SECRET` fields. Those can be found in the app configuration.

    Note the `AUTHORIZATION_GRANTED` field. That url should be where the local copy of the Member Directory is served.
