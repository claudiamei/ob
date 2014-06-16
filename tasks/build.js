console.log('BUILD amelia-ui ...');

var src = require('./src');
var docs = require('./docs');

var path = require('path');
var Q = require('q');

Q.all([
  src.js.build(),
  src.css.build(),
  docs.html.build(),
  docs.css.build()

])
  .then(function() {});
