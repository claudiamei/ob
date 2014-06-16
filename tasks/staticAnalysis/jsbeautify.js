var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

var filesToBeautify = [
  path.join('docs', '**', '*.js'),
  path.join('docs', '**', '*.css'),
  path.join('src', '**', '*.js'),
  path.join('src', '**', '*.css'),
  '!' + path.join('docs', 'lib', '**', '*'),
  '!' + path.join('src', 'lib', '**', '*'),
  path.join('tasks', '**', '*.js'),
];

var verifyOnly = function () {
  gulp.src(filesToBeautify)
    .pipe(prettify(
      {
        config: '.jsbeautifyrc',
        mode: 'VERIFY_ONLY'
      }));
};

var verifyAndFix = function () {
  gulp.src(filesToBeautify, {base: './'})
    .pipe(prettify(
      {
        config: '.jsbeautifyrc',
        mode: 'VERIFY_AND_WRITE'
      })).pipe(gulp.dest('./'));
};

module.exports = {
  verifyOnly: verifyOnly,
  verifyAndFix: verifyAndFix
};