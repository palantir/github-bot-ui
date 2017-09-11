/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

import React from 'react';
import ReactDOM from 'react-dom';
import GitHubBotUi from '../src';

const container = document.getElementById('container');
ReactDOM.render(<GitHubBotUi appName="GitHub Bot UI" gitHubUrl="https://github.com" docsUrl="https://developer.github.com/v3/"/>, container);
