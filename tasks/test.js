console.log('TEST amelia-ui ...');

var src = require('./src');
var docs = require('./docs');

var path = require('path');
var Q = require('q');

Q.all([
	// docs.html.build(),
	src.js.test(),
	docs.js.test()
])
.then(function () {});
