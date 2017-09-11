/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import { CALL_API } from '../middleware/api.js';

export const CHANGE_REPO_STATE = 'CHANGE_REPO_STATE';
export const CHANGE_REPO_STATE_SUCCESS = 'CHANGE_REPO_STATE_SUCCESS';
export const CHANGE_REPO_STATE_FAILURE = 'CHANGE_REPO_STATE_FAILURE';

export function enableRepo(user, repo) {
  return {
    [CALL_API]: {
      types: [ CHANGE_REPO_STATE, CHANGE_REPO_STATE_SUCCESS, CHANGE_REPO_STATE_FAILURE ],
      endpoint: `repo/${repo.owner}/${repo.name}`,
      params: {
        method: 'POST'
      },
      user
    },
    id: repo.id,
    isEnabled: true,
    user: user
  };
}

export function disableRepo(user, repo) {
  return {
    [CALL_API]: {
      types: [ CHANGE_REPO_STATE, CHANGE_REPO_STATE_SUCCESS, CHANGE_REPO_STATE_FAILURE ],
      endpoint: `repo/${repo.owner}/${repo.name}`,
      params: {
        method: 'DELETE'
      },
      user
    },
    id: repo.id,
    isEnabled: false,
    user: user
  };
}

export const CLEAR_REPO_SAVE_STATUS = 'CLEAR_REPO_SAVE_STATUS';

export function clearRepoSaveStatus(repo) {
  return {
    type: CLEAR_REPO_SAVE_STATUS,
    id: repo.id
  };
}

export const LOAD_REPOS = 'LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_FAILURE = 'LOAD_REPOS_FAILURE';

export function loadRepos(user) {
  return {
    [CALL_API]: {
      types: [ LOAD_REPOS, LOAD_REPOS_SUCCESS, LOAD_REPOS_FAILURE ],
      endpoint: 'user/repos',
      user
    }
  };
}
