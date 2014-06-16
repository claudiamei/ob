var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();
var map = require('map-stream');

var utils = require('../utils');

var reporter = require('jshint-stylish');
var jshintRc = '.jshintrc';

var test = {
  hint: function hint() {
    var js_files = path.join('docs', '**', '*.js'),
      ignore = path.join('docs', 'lib', '**', '*');
    return gulp.src([js_files, '!' + ignore])
      .pipe(tasks.jshint(jshintRc))
      .pipe(tasks.jshint.reporter(reporter))
      // .pipe(jshint.reporter('fail'));
  }
}

module.exports = {
  watch: function(connect) {
    var js_files = path.join('docs', '**', '*.js');
    var tasks = [test.hint];
    gulp.watch([js_files], function(event) {
      utils.run_tasks(__filename, tasks).done(function() {
        utils.reload(connect, event.path);
      });
    });
  },
  test: function() {
    var tasks = [test.hint];
    return utils.run_tasks(__filename, tasks);
  }
}
