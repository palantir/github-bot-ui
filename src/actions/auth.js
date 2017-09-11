/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import { CALL_API } from '../middleware/api.js';

export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const REQUEST_TOKEN_SUCCESS = 'REQUEST_TOKEN_SUCCESS';
export const REQUEST_TOKEN_FAILURE = 'REQUEST_TOKEN_FAILURE';

export function requestToken(code, state) {
  const query = [
    'code=' + encodeURIComponent(code),
    'state=' + encodeURIComponent(state)
  ].join('&');

  return {
    [CALL_API]: {
      types: [ REQUEST_TOKEN, REQUEST_TOKEN_SUCCESS, REQUEST_TOKEN_FAILURE ],
      endpoint: `auth/github/token?${query}`
    }
  };
}

export const DELETE_TOKEN = 'DELETE_TOKEN';

export function deleteToken() {
  return {
    type: DELETE_TOKEN
  };
}

export const SET_LOGIN_REDIRECT = 'SET_LOGIN_REDIRECT';
export const CLEAR_LOGIN_REDIRECT = 'CLEAR_LOGIN_REDIRECT';

export function setLoginRedirect(redirect) {
  return {
    type: SET_LOGIN_REDIRECT,
    redirect
  };
}

export function clearLoginRedirect() {
  return {
    type: CLEAR_LOGIN_REDIRECT
  };
}
