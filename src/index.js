/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import configureStore from './configureStore.js';

import App from './containers/App.js';
import Login from './containers/Login.js';
import UserRepos from './containers/UserRepos.js';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const UserIsAuthenticated = UserAuthWrapper({
  authSelector: (state) => state.user,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});

export default (botUiProps) => {
  const WithProps = (Component) => {
    return (props) => <Component {...botUiProps} {...props} />;
  };

  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={WithProps(App)}>
          <IndexRedirect to="/repositories" />
          <Route path="login" component={WithProps(Login)} />
          <Route path="repositories" component={WithProps(UserIsAuthenticated(UserRepos))} />
        </Route>
      </Router>
    </Provider>
  );
};
