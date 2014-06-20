console.log('TEST amelia-ui ...');

var src = require('./src');
var docs = require('./docs');
var jsBeautify = require('./staticAnalysis/jsbeautify.js');
var path = require('path');
var Q = require('q');

Q.all([
  src.js.test(),
  jsBeautify.verifyOnly(),
  docs.js.test()
])
  .then(function() {});
