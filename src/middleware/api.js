/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import 'isomorphic-fetch';
import { replace } from 'react-router-redux';
import { deleteToken } from '../actions/auth.js';

export const CALL_API = Symbol('CALL API');

function processBody(res) {
  let contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (contentType.indexOf('application/json') >= 0) {
    return res.json();
  } else {
    return {};
  }
}

function checkStatus(res) {
  if (res.ok) {
    return res;
  } else {
    const error = new Error(res.statusText || res.status);
    error.status = res.status;
    throw error;
  }
}

function request(url, params = {}, user = false) {
  params.method = params.method || 'GET';
  params.headers = params.headers || {};
  if (user) {
    params.headers['Authorization'] = `Bearer ${user.token}`;
  }
  return fetch(url, params)
    .then(checkStatus)
    .then(processBody);
}

export default () => next => action => {
  const callApi = action[CALL_API];
  if (!callApi) {
    return next(action);
  }

  function actionWith(data) {
    const actionCopy = Object.assign({}, action, data);
    delete actionCopy[CALL_API];
    return actionCopy;
  }

  const { types, endpoint, params, user } = callApi;

  const [ REQUEST, SUCCESS, FAILURE ] = types;
  next(actionWith({type: REQUEST}));

  const url = `/api/${endpoint}`;
  return request(url, params, user).then(
    (data) => {
      next(actionWith({
        type: SUCCESS,
        data
      }));
    },
    (error) => {
      if (error.status === 401) {
        next(deleteToken());
        next(replace('/login'));
      } else {
        next(actionWith({
          type: FAILURE,
          error: error.message || 'API Request Error'
        }));
      }
    }
  );
};
