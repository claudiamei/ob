var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();

var utils = require('../utils');

var serve = {
  outbrain_font: function outbrain_font() {
    gulp.src(['src/icons/*.svg'])
      .pipe(tasks.iconfontCss({
        fontName: 'outbrain',
        // path: path.join('src', 'icons', 'icons.css'),
        targetPath: 'outbrain.css',
        // fontPath: path.join('docs', '.tmp', 'fonts') + '/'
      }))
      .pipe(tasks.iconfont({
        fontName: 'outbrain', // required
        appendCodepoints: false // recommended option
      }))
      .on('codepoints', function(codepoints, options) {
        // CSS templating, e.g.
        console.log(codepoints, options);
      })
      .pipe(gulp.dest(path.join('docs', '.tmp', 'fonts')));
  }
};

module.exports = {
  serve: function() {
    var tasks = [serve.outbrain_font];
    return utils.run_tasks(__filename, tasks);
  },
  build: function() {
    var tasks = [];
    return utils.run_tasks(__filename, tasks);
  },
  watch: function(connect) {
    var icons = path.join('src', 'icons', '*.svg');
    gulp.watch([icons], function(event) {
      var tasks = [serve.outbrain_font];
      utils.run_tasks(__filename, tasks).then(function() {
        utils.reload(connect, event.path);
      });
    });
  }
};
