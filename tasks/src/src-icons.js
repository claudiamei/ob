var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();

var utils = require('../utils');

var serve = {
  outbrain_font: function outbrain_font() {
    var
      icons = path.join('src', 'components', 'icons', '*.svg');
    dest = path.join('docs', '.tmp'),
    config = {
      cssFile: 'amelia-sprite.css',
      svgPath: "%f",
      // pngPath: "%f",
      svg: {
        sprite: "amelia-sprite.svg"
      }
    };
    return gulp.src(icons)
      .pipe(tasks.svgSprites.svg(config))
      .pipe(gulp.dest(dest))
      // .pipe(tasks.svgSprites.png())
      // .pipe(gulp.dest(dest));
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
    var icons = path.join('src', 'components', 'icons', '*.svg');
    gulp.watch([icons], function(event) {
      var tasks = [serve.outbrain_font];
      utils.run_tasks(__filename, tasks).then(function() {
        utils.reload(connect, event.path);
      });
    });
  }
};
