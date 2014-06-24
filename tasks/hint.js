console.log('JSHint files ...');

var jshint = require('./staticAnalysis/jshint.js');
var path = require('path');
//var Q = require('q');

var filesToHint = [
  path.join('docs', '**', '*.js'),
  //path.join('src', '**', '*.js'),
  '!' + path.join('docs', 'lib', '**', '*'),
  '!' + path.join('src', 'lib', '**', '*')
  //path.join('tasks', '**', '*.js'),
];


jshint.jshintFiles(filesToHint);

// Q.all([
//   src.js.test(),
//   jsBeautify.verifyOnly(filesToBeautify),
//   docs.js.test()
// ])
//  .then(function() {});