/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import React from 'react';

class RepoHeader extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.onStateChange(event.target.checked);
  }

  render() {
    const { gitHubUrl, owner, name, isEnabled, stateIcon, isUserAdmin } = this.props;
    const link = `${gitHubUrl}/${owner}/${name}`;
    return (
      <div className="repository-header">
        <a className="repository-name" href={link}>{owner}/<b>{name}</b></a>
        {stateIcon}
        <label className="pt-control pt-switch">
          <input type="checkbox" checked={isEnabled || false} onChange={this.onChange} disabled={!isUserAdmin} />
          <span className="pt-control-indicator"></span>
          {isEnabled ? 'On' : 'Off'}
        </label>
      </div>
    );
  }
}
RepoHeader.propTypes = {
  gitHubUrl: React.PropTypes.string.isRequired,
  owner: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  onStateChange: React.PropTypes.func.isRequired,
  stateIcon: React.PropTypes.element,
  isEnabled: React.PropTypes.bool,
  isUserAdmin: React.PropTypes.bool
};

export class Repo extends React.Component {
  render() {
    const { isEnabled } = this.props;

    let details = null;
    if (isEnabled) {
      details = <div className="repository-details pt-text-muted">{this.props.children}</div>;
    }

    return (
      <li className={"repository " + (isEnabled ? "enabled" : "disabled")}>
        <RepoHeader {...this.props} />
        {details}
      </li>
    );
  }
}
Repo.propTypes = Object.assign({}, RepoHeader.propTypes);
