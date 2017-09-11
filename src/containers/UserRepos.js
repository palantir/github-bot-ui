/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import React from 'react';
import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import { Intent, Spinner, Tooltip } from '@blueprintjs/core';

import { enableRepo, disableRepo, clearRepoSaveStatus, loadRepos } from '../actions/repo.js';
import { GroupedRepoList } from '../components/repo/groupedRepoList.js';

const STATE_ICON_TIMEOUT = 5000;

class UserRepos extends React.Component {
  constructor() {
    super();
    this.handleRepoStateChange = this.handleRepoStateChange.bind(this);
    this.renderStateIcon = this.renderStateIcon.bind(this);
  }

  componentWillMount() {
    this.props.loadRepos(this.props.user);
  }

  renderRepo(repo) {
    let enabledAt = 'unknown';
    if (repo.enabledAt) {
      const d = moment(repo.enabledAt);
      enabledAt = (
        <time dateTime={d.toISOString()} title={d.format('LLL')}>
          {d.fromNow()}
        </time>
      );
    }
    return <small>Enabled by {repo.enabledBy || 'unknown'} {enabledAt}</small>;
  }

  renderStateIcon(repo) {
    const saveStatus = this.props.saveStatus[repo.id];
    switch (saveStatus) {
      case 'error':
        return (
          <Tooltip intent={Intent.WARNING} content="Changes were not saved">
            <span className="pt-icon-standard pt-icon-warning-sign" />
          </Tooltip>
        );
      case 'saving':
        return <Spinner className="pt-intent-primary pt-small" />;
      case 'saved':
        setTimeout(() => this.props.clearRepoSaveStatus(repo), STATE_ICON_TIMEOUT);
        return (
          <Tooltip intent={Intent.SUCCESS} content="All changes saved">
            <span className="pt-icon-standard pt-icon-tick" />
          </Tooltip>
        );
    }
  }

  handleRepoStateChange(repo, enabled) {
    if (enabled) {
      this.props.enableRepo(this.props.user, repo);
    } else {
      this.props.disableRepo(this.props.user, repo);
    }
  }

  render() {
    return (
      <GroupedRepoList
          gitHubUrl={this.props.gitHubUrl}
          loading={this.props.loading}
          groups={this.props.groups}
          onRepoStateChange={this.handleRepoStateChange}
          renderStateIcon={this.renderStateIcon}
          renderRepo={this.renderRepo} />
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.isLoading,
    user: state.user,
    groups: groupBy(state.repositories, 'owner'),
    saveStatus: state.saveStatus
  };
}

export default connect(
  mapStateToProps,
  {enableRepo, disableRepo, clearRepoSaveStatus, loadRepos}
)(UserRepos);
