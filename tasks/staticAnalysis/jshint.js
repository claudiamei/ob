var gulp = require('gulp');
var jshint = require('gulp-jshint');
var reporter = require('jshint-stylish');

var jshintFiles = function(files) {
  gulp.src(files)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(reporter));
};


module.exports = {
  jshintFiles: jshintFiles
};
