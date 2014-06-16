var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();

var utils = require('../utils');

module.exports = {
  watch: function(connect) {
    var templates = path.join('src', '**', '*.html');
    var ignore = path.join('src', '**', 'docs', '*.html');
    gulp.watch([templates, '!' + ignore], function(event) {
      utils.reload(connect, event.path);
    });
  }
};
