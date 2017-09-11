/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import React from 'react';
import sortBy from 'lodash/sortBy';
import { RepoList } from './repoList.js';
import { Spinner } from "@blueprintjs/core";

export class GroupedRepoList extends React.Component {
  render() {
    const { gitHubUrl, groups, renderStateIcon, renderRepo, onRepoStateChange } = this.props;
    const orderedGroups = sortBy(Object.keys(groups), (g) => g.toLowerCase());

    if (this.props.loading) {
      return (<Spinner className="pt-large loading-repos"/>);
    }

    const lists = orderedGroups.map((group) => {
      const orderedRepos = sortBy(groups[group], ['name']);
      return (
        <RepoList
            gitHubUrl={gitHubUrl}
            key={group}
            header={group}
            repos={orderedRepos}
            onRepoStateChange={onRepoStateChange}
            renderStateIcon={renderStateIcon}
            renderRepo={renderRepo} />
      );
    });
    return <div className="grouped-repo-list">{lists}</div>;
  }
}

GroupedRepoList.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  groups: React.PropTypes.object.isRequired,
  onRepoStateChange: React.PropTypes.func.isRequired,
  renderRepo: React.PropTypes.func.isRequired,
  renderStateIcon: React.PropTypes.func
};
