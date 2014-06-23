var jsBeautify = require('./staticAnalysis/jsbeautify.js');

var path = require('path');

var filesToBeautify = [
  path.join('docs', '**', '*.js'),
  path.join('docs', '**', '*.css'),
  path.join('src', '**', '*.js'),
  path.join('src', '**', '*.css'),
  '!' + path.join('docs', 'lib', '**', '*'),
  '!' + path.join('src', 'lib', '**', '*'),
  path.join('tasks', '**', '*.js'),
];

jsBeautify.fixCodeStyle(filesToBeautify);
