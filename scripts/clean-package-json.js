/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

var path = require('path');
var fs = require('fs');

var input = path.resolve(__dirname, '../package.json');
var output = process.argv[2];
if (!output) {
  console.error('usage: ' + process.argv[1] + ' <output>');
  process.exit(1);
}

var packageJson = JSON.parse(fs.readFileSync(input, 'utf-8'));

packageJson.main = 'lib/index.js';
delete packageJson.devDependencies;

fs.writeFileSync(output, JSON.stringify(packageJson, null, 2));
