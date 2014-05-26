var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();

var utils = require('../utils');

module.exports = {
	watch: function (connect) {
		var templates = path.join('src', '**', '*.html');
		gulp.watch([templates], function (event) {
			utils.reload(connect, event.path);
		});
	}
};