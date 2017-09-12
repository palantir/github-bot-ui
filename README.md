# github-bot-ui

[![npm](https://img.shields.io/npm/v/github-bot-ui.svg?style=flat-square)]()
[![CircleCI](https://img.shields.io/circleci/project/github/palantir/github-bot-ui/master.svg?style=flat-square)]()

A React + Redux application that serves as a base for GitHub bot UIs. It
manages login, provides a page to enable or disable the bot on repositories,
and has extensibility points for bots that require additional settings.

![Screenshot of GitHub Bot UI](/github-bot-ui.png)

## Usage

Most user will consume the application as a whole, passing some properties at
the top level to customize things. You can find a working example of the
integration in the `example` directory and in the `server.js` file.

1. Add the library (and React) to your project:


   ```
   npm install github-bot-ui react react-dom
   ```

2. Create a minimal `index.html` file in which to inject the application:


   ```html
   <!doctype html>
   <html>
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
     </head>
     <body>
       <div id="container"></div>
     </body>
   </html>
   ```

3. Create an `index.js` file to initialize the application:


   ```js
   import React from 'react';
   import ReactDOM from 'react-dom';
   import GitHubBotUi from 'github-bot-ui';

   const container = document.getElementById('container');
   ReactDOM.render(
     <GitHubBotUi
       appName="My Bot"
       gitHubUrl="https://github.com"
       docsUrl="https://github.com/myorg/mybot"/>,
     container
   );
   ```

4. Create a file that aggregates the dependency CSS files. Here we'll use SCSS,
   but you can use any method in your project:


   ```
   @import "~normalize.css";
   @import "~@blueprintjs/core/dist/blueprint.css";
   @import "~github-bot-ui/github-bot-ui.css";
   ```

   Note that we're including the dependency styles from Blueprint as well.

5. Configure Webpack or another builder to compile the files and generate a
   bundle. Configuring Webpack is outside the scope of this guide, but you can
   find a working configuration in `server.js`.


## Server Endpoints

The UI expects the server to expose specific endpoints to function. You can
find a mock implementation of these endpoints in `server.js`.

### `GET /api/auth/github`

Redirects to the GitHub OAuth endpoint with correct parameters. The OAuth
application should be configured to redirect to `/login` after authentication.
The `/login` route is handled `github-bot-ui`.

### `GET /api/auth/github/token`

**Query Parameters:**

- `code` - the GitHub OAuth code
- `state` - the OAuth state value provided in the initial redirect

Returns an object with a `token` property. This property contains a 
[JWT](https://jwt.io/) for the user that just authenticated. The
token must contain the `sub` field, but all other fields are optional.

`github-bot-ui` will provide this as a `Bearer` token in the `Authorization`
header with future requests. The server usually maintains a mapping from
information in the JWT to the GitHub OAuth token for the corresponding user.

### `GET /api/user/repos`

Returns a JSON list of repositories to which the user has write access and
their status with the bot. Each object in the list has the following
properties:

- `id` - (number, required) a unique numeric ID for the repository
- `owner` - (string, required) the user or organization that owns the
  repository
- `name` - (string, required) the name of the repository
- `isEnabled` - (boolean, required) indicates if the bot is enabled for this
  repository
- `isUserAdmin` - (boolean, required) indicates if the current user has admin
  permissions on the repository
- `enabledBy` - (string, optional) if the bot is enabled for this repository,
  the name of the enabling user
- `enabledAt` - (string, optional) if the bot is enabled for this repository,
  the date and time at which it was enabled, in RFC3339/ISO8601 format.

### `POST /api/repo/:owner/:name`

Enables the bot for a repository. On success, returns `200 OK` with a JSON
representation of the repository as described above.

### `DELETE /api/repo/:owner/:name`

Disables the bot for a repository. On success, returns `204 No Content`.
