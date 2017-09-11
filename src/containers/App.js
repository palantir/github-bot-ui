/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import React from 'react';
import { connect } from 'react-redux';
import { deleteToken } from '../actions/auth.js';
import NavBar from './NavBar.js';

import { FocusStyleManager } from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar
            appName={this.props.appName}
            docsUrl={this.props.docsUrl}
            isAuthenticated={this.props.isAuthenticated}
            onLogout={this.props.deleteToken} />
        <div className="pt-app">
          {this.props.children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.user.token
  };
}

export default connect(
  mapStateToProps,
  { deleteToken }
)(App);
