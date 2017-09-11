/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import React from 'react';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import { AnchorButton, Spinner, Toaster, Intent } from '@blueprintjs/core';

import { requestToken, setLoginRedirect, clearLoginRedirect } from '../actions/auth.js';

class Login extends React.Component {

  componentWillMount() {
    this.redirectIfAuthenticated(this.props);

    const { isTokenRequest, location, loginRedirect } = this.props;
    const { code, state, redirect } = location.query;

    if (redirect && redirect !== loginRedirect) {
      this.props.setLoginRedirect(redirect);
    }

    if (isTokenRequest) {
      this.props.requestToken(code, state);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.redirectIfAuthenticated(nextProps);
    this.displayError(nextProps);
  }

  redirectIfAuthenticated(props) {
    const { isAuthenticated, replace, loginRedirect } = props;
    if (isAuthenticated) {
      props.clearLoginRedirect();
      replace(loginRedirect);
    }
  }

  displayError(props) {
    if (props.error) {
      Toaster.show({
        intent: Intent.DANGER,
        message: props.error
      });
    }
  }

  render() {
    let component;
    if (this.props.isTokenRequest) {
      component = <Spinner className="pt-intent-primary" />;
    } else {
      component = (
        <AnchorButton className="pt-intent-primary pt-large" iconName="log-in" href="/api/auth/github">
          Login with GitHub
        </AnchorButton>
      );
    }

    return (
      <div className="login-container">
        <h1>{this.props.appName}</h1>
        {component}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { query } = ownProps.location;

  return {
    isAuthenticated: state.user.token || false,
    isTokenRequest: query.code && query.state && !state.user.error,
    error: query.error_description || state.user.error || false,
    loginRedirect: state.loginRedirect
  };
}

export default connect(
  mapStateToProps,
  {requestToken, setLoginRedirect, clearLoginRedirect, replace}
)(Login);
