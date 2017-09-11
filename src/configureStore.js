/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import api from './middleware/api.js';
import rootReducer from './reducers';
import { persistState } from './persist.js';

const router = routerMiddleware(browserHistory);

export default function configureStore() {

  let middleware;
  if (process.env.NODE_ENV === 'production') {
    middleware = applyMiddleware(thunk, api, router);
  } else {
    const createLogger = require('redux-logger');
    middleware = applyMiddleware(thunk, api, router, createLogger());
  }

  const store = createStore(rootReducer, middleware);
  persistState({
    key: 'token',
    select: (state) => state.user.token,
    nullValue: null
  }, {
    key: 'loginRedirect',
    select: (state) => state.loginRedirect,
    nullValue: '/'
  })(store, window.sessionStorage);

  return store;
}
