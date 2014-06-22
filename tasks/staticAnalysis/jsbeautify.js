var Q = require('q');
var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

var verifyCodeStyle = function(filesToBeautify) {
  gulp.src(filesToBeautify)
    .pipe(prettify({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_ONLY'
    }));
};

var fixCodeStyle = function(filesToBeautify) {
  gulp.src(filesToBeautify, {
    base: './'
  })
    .pipe(prettify({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    })).pipe(gulp.dest('./'));
};

module.exports = {
  verifyCodeStyle: verifyCodeStyle,
  fixCodeStyle: fixCodeStyle
};
