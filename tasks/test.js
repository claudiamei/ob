console.log('TEST amelia-ui ...');

var src = require('./src');
var jsBeautify = require('./staticAnalysis/jsbeautify.js');
var jshint = require('./staticAnalysis/jshint.js');
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

var filesToHint = [
  path.join('docs', '**', '*.js'),
  //path.join('src', '**', '*.js'),
  '!' + path.join('docs', 'lib', '**', '*'),
  '!' + path.join('src', 'lib', '**', '*')
  //path.join('tasks', '**', '*.js'),
];

Q.all([
  jshint.jshintFiles(filesToHint),
  // src.js.test(), // no tests ro run right now
  jsBeautify.verifyCodeStyle(filesToBeautify)
])
  .then(function() {});
