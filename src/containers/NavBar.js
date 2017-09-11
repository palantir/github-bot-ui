/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import React from 'react';
import { Link } from 'react-router';

const LogoutButton = (props) => {
  if (props.isAuthenticated) {
    return <Link to="/login" title="Logout" onClick={props.onClick} className="pt-button pt-minimal pt-icon-log-out" />;
  } else {
    return null;
  }
};

export default class NavBar extends React.Component {
  render() {
    const { docsUrl, appName } = this.props;
    return (
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">{appName}</div>
          <span class="pt-navbar-divider"></span>
          <Link to="/repositories" title="Repositories" activeClassName="pt-active" className="pt-button pt-minimal pt-icon-git-branch">Repositories</Link>
          {docsUrl ? <a href={docsUrl} title="Documentation" target="_blank" className="pt-button pt-minimal pt-icon-book">Documentation</a> : null}
        </div>
        <div className="pt-navbar-group pt-align-right">
          <LogoutButton
              isAuthenticated={this.props.isAuthenticated}
              onClick={this.props.onLogout} />
        </div>
      </nav>
    );
  }
}
