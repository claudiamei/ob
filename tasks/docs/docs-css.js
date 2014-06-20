var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();

var utils = require('../utils');

var build = {
  docs: function docs() {
    // build docs css and save to docs/.tmp
    var docs = path.join('docs', 'docs.less');
    var dest = path.join('docs', '.tmp');
    return gulp.src(docs)
      .pipe(tasks.less({
        // sourceMap: true
      }))
      .pipe(gulp.dest(dest));
  }
};

module.exports = {
  build: function() {
    var tasks = [build.docs];
    return utils.run_tasks(__filename, tasks);
  },
  watch: function(connect) {
    var docs = path.join('docs', 'docs.less');
    var components = path.join('docs', '**', '*.less');
    gulp.watch([docs, components], function(event) {
      var tasks = [build.docs];
      utils.run_tasks(__filename, tasks).then(function() {
        utils.reload(connect, event.path);
      });
      // utils.reload(connect, event.path);
    });
  }
};
