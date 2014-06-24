var Q = require('q');
var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

var verifyCodeStyle = function(files) {
  gulp.src(files)
    .pipe(prettify({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_ONLY'
    }));
};

var fixCodeStyle = function(files) {
  gulp.src(files, {
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
