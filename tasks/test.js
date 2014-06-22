console.log('TEST amelia-ui ...');

var src = require('./src');
var docs = require('./docs');
var jsBeautify = require('./staticAnalysis/jsbeautify.js');
var path = require('path');
var Q = require('q');

var filesToBeautify = [
  path.join('docs', '**', '*.js'),
  path.join('docs', '**', '*.css'),
  path.join('src', '**', '*.js'),
  path.join('src', '**', '*.css'),
  '!' + path.join('docs', 'lib', '**', '*'),
  '!' + path.join('src', 'lib', '**', '*'),
  path.join('tasks', '**', '*.js'),
];

Q.all([
  src.js.test(),
  jsBeautify.verifyCodeStyle(filesToBeautify),
  docs.js.test()
])
  .then(function() {});
