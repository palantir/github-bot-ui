/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import React from 'react';
import { Repo } from './repo.js';

export class RepoList extends React.Component {
  render() {
    const { gitHubUrl, renderStateIcon } = this.props;

    const repos = this.props.repos.map((repo) => {
      const onStateChange = (enabled) => {
        this.props.onRepoStateChange(repo, enabled);
      };

      const stateIcon = renderStateIcon ? renderStateIcon(repo) : null;
      return (
        <Repo gitHubUrl={gitHubUrl} key={repo.name} {...repo} stateIcon={stateIcon} onStateChange={onStateChange}>
          {this.props.renderRepo(repo)}
        </Repo>
      );
    });

    return (
      <div className="repository-list">
          {this.maybeRenderHeader.bind(this)()}
        <ul>{repos}</ul>
      </div>
    );
  }

  maybeRenderHeader() {
    if (this.props.header !== undefined) {
      return (
        <div className="repository-list-header">
          <span className="pt-icon-projects"/>
          <h3>{this.props.header}</h3>
        </div>
      );
    } else {
      return null;
    }
  }
}

RepoList.propTypes = {
  header: React.PropTypes.node,
  repos: React.PropTypes.array.isRequired,
  onRepoStateChange: React.PropTypes.func.isRequired,
  renderRepo: React.PropTypes.func.isRequired,
  renderStateIcon: React.PropTypes.func
};

