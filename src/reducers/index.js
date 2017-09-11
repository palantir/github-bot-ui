/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import merge from 'lodash/merge';
import keyBy from 'lodash/keyBy';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import {
  REQUEST_TOKEN_SUCCESS,
  REQUEST_TOKEN_FAILURE,
  DELETE_TOKEN,
  SET_LOGIN_REDIRECT,
  CLEAR_LOGIN_REDIRECT
} from '../actions/auth.js';

import {
  CHANGE_REPO_STATE,
  CHANGE_REPO_STATE_SUCCESS,
  CHANGE_REPO_STATE_FAILURE,
  CLEAR_REPO_SAVE_STATUS,
  LOAD_REPOS_SUCCESS
} from '../actions/repo.js';

function initialUserState() {
  const token = window.sessionStorage.getItem('token');
  const state = {};
  if (token) {
    state.token = token;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      state.name = payload.sub;
    } catch (e) {
      // assume the token was not a JWT and continue without values
    }
  }
  return state;
}

function initialLoginRedirectState() {
  const loginRedirect = window.sessionStorage.getItem('loginRedirect');
  return loginRedirect || '/';
}

export function user(state = initialUserState(), action) {
  switch (action.type) {
    case REQUEST_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        token: action.data.token
      });
    case REQUEST_TOKEN_FAILURE:
      return Object.assign({}, state, {
        error: action.error
      });
    case DELETE_TOKEN:
      return Object.assign({}, state, {
        token: null
      });
    default:
      return state;
  }
}

export function loginRedirect(state = initialLoginRedirectState(), action) {
  switch (action.type) {
    case SET_LOGIN_REDIRECT:
      return action.redirect;
    case CLEAR_LOGIN_REDIRECT:
      return '/';
    default:
      return state;
  }
}

export function saveStatus(state = {}, action) {
  switch (action.type) {
    case CHANGE_REPO_STATE:
      return Object.assign({}, state, {
        [action.id]: 'saving'
      });
    case CHANGE_REPO_STATE_SUCCESS:
      return Object.assign({}, state, {
        [action.id]: 'saved'
      });
    case CHANGE_REPO_STATE_FAILURE:
      return Object.assign({}, state, {
        [action.id]: 'error'
      });
    case CLEAR_REPO_SAVE_STATUS:
      return Object.assign({}, state, {
        [action.id]: null
      });
    default:
      return state;
  }
}

export function repositories(state = {}, action) {
  switch (action.type) {
    case LOAD_REPOS_SUCCESS:
      return merge({}, state, keyBy(action.data, 'id'));
    case CHANGE_REPO_STATE:
      return merge({}, state, {
        [action.id]: {
          isEnabled: action.isEnabled,
          enabledAt: action.isEnabled ? new Date() : null,
          enabledBy: action.isEnabled ? action.user.name : null
        }
      });
    case CHANGE_REPO_STATE_SUCCESS:
      return merge({}, state, {
        [action.id]: action.data
      });
    default:
      return state;
  }
}

export function loading(state = { isLoading: true }, action) {
  switch (action.type) {
    case LOAD_REPOS_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  loading,
  user,
  loginRedirect,
  saveStatus,
  repositories,
  routing: routerReducer
});

export default rootReducer;
