var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();

var utils = require('../utils');

var serve = {
  bootstrap_theme: function bootstrap_theme() {
    // build amelia css and save to docs/.tmp
    var bootstrap_theme = path.join('src', 'bootstrap-theme.less');
    var dest = path.join('docs', '.tmp');
    return gulp.src(bootstrap_theme)
      .pipe(tasks.less({
        // sourceMap: true
      }))
      .pipe(gulp.dest(dest));
  },
  amelia: function amelia() {
    // build amelia css and save to docs/.tmp
    var amelia = path.join('src', 'amelia-ui.less');
    var dest = path.join('docs', '.tmp');
    return gulp.src(amelia)
      .pipe(tasks.less({
        // sourceMap: true
      }))
      .pipe(gulp.dest(dest));
  }
};

// var build = {
//     bootstrap: function bootstrap() {
//         var bootstrap = path.join('docs', 'bower_components', 'bootstrap', 'dist', 'css', 'bootstrap.css');
//         var min_bootstrap = path.join('docs', 'bower_components', 'bootstrap', 'dist', 'css', 'bootstrap.min.css');
//         return gulp.src([bootstrap, min_bootstrap])
//             .pipe(gulp.dest('dist'));
//     },
//     bootstrap_override: function bootstrap_override() {
//         var bootstrap_less = path.join('docs', 'bower_components', 'bootstrap', 'less', '*.less');
//         var not_bootstrap_less = path.join('!docs', 'bower_components', 'bootstrap', 'less', 'bootstrap.less');
//         var not_bootstrap_theme = path.join('!docs', 'bower_components', 'bootstrap', 'less', 'bootstheme.less');
//         var bs_variables = path.join('src', 'misc', 'bs_variables.less');
//         var ob_variables = path.join('src', 'misc', 'ob_variables.less');
//         return gulp.src([bs_variables, ob_variables, bootstrap_less, not_bootstrap_less])
//             .pipe(tasks.concat('bootstrap-override.less'))
//             .pipe(tasks.less())
//             .pipe(tasks.concat('bootstrap-override.css'))
//             .pipe(gulp.dest('dist'))
//             .pipe(tasks.css())
//             .pipe(tasks.rename('bootstrap-override.min.css'))
//             .pipe(gulp.dest('dist'));
//     },
//     amelia: function amelia() {
//         // build amelia css and save /dist
//         // var amelia = path.join('src', 'amelia-ui.less');
//         var amelia_less = path.join('src', '**', '*.less');
//         var not_amelia_less = path.join('!src', 'amelia-ui.less');
//         // var not_bootstrap_theme = path.join('!docs', 'bower_components', 'bootstrap', 'less', 'bootstheme.less');
//         var bs_mixins = path.join('docs', 'bower_components', 'bootstrap', 'less', 'mixins.less');
//         var bs_variables = path.join('src', 'misc', 'bs_variables.less');
//         var ob_variables = path.join('src', 'misc', 'ob_variables.less');
//         var dest = 'dist';
//         return gulp.src([bs_variables, bs_mixins, ob_variables, amelia_less, not_amelia_less])
//             .pipe(tasks.concat('amelia-ui.less'))
//             .pipe(tasks.less())
//             .pipe(tasks.rename('amelia-ui.css'))
//             .pipe(gulp.dest(dest))
//             .pipe(gulp.dest(path.join('docs', '.tmp'))) // add un-minified version to docs
//             .pipe(tasks.csso())
//             .pipe(tasks.rename('amelia-ui.min.css'))
//             .pipe(gulp.dest(dest));
//     }
// };


var build = {
  bootstrap_theme: function bootstrap_theme() {
    var
      bootstrap = path.join('src', 'lib', 'bootstrap', 'less', 'bootstrap.less'),
      override_variables = path.join('src', 'amelia_variables.less'),
      bs_variables = path.join('src', 'bootstrap_variables.less'),
      destination = 'dist';

    return gulp.src([bootstrap, override_variables, bs_variables])
      .pipe(tasks.concat('bootstrap-theme.less'))
      .pipe(tasks.less())
      .pipe(tasks.rename('bootstrap-theme.css'))
      .pipe(gulp.dest(destination))
      .pipe(tasks.csso())
      .pipe(tasks.rename('bootstrap-theme.min.css'))
      .pipe(gulp.dest(destination));
  },
  components: function components() {
    var
      bs_variables = path.join('src', 'bootstrap_variables.less'),
      ob_variables = path.join('src', 'amelia_variables.less'),
      bs_mixins = path.join('src', 'lib', 'bootstrap', 'less', 'mixins.less'),
      bs_overrides = path.join('src', 'bootstrap_overrides.less'),
      ob_mixins,
      components = path.join('src', 'components', '**', '*.less'),
      amelia = path.join('src', 'amelia-ui.less'),
      bootstrap_theme = path.join('src', 'bootstrap-theme.less'),
      destination = 'dist';

    return gulp.src([bs_variables, ob_variables, bs_mixins, bs_overrides, components, '!'+amelia, '!'+bootstrap_theme])
      .pipe(tasks.concat('amelia-ui.less'))
      .pipe(tasks.less())
      .pipe(tasks.rename('amelia-ui.css'))
      .pipe(gulp.dest(destination))
      .pipe(tasks.csso())
      .pipe(tasks.rename('amelia-ui.min.css'))
      .pipe(gulp.dest(destination));
  }
}

module.exports = {
  serve: function() {
    var tasks = [serve.amelia, serve.bootstrap_theme];
    return utils.run_tasks(__filename, tasks);
  },
  build: function() {
    // var tasks = [build.bootstrap, build.bootstrap_override, build.amelia];
    var tasks = [build.bootstrap_theme, build.components];
    return utils.run_tasks(__filename, tasks);
  },
  watch: function(connect) {
    var amelia = path.join('src', 'amelia-ui.less');
    var amelia = path.join('src', 'bootstrap-theme.less');
    var components = path.join('src', '**', '*.less');
    gulp.watch([amelia, components], function(event) {
      var tasks = [serve.amelia, serve.bootstrap_theme];
      utils.run_tasks(__filename, tasks).then(function() {
        utils.reload(connect, event.path);
      });
    });
  }
};
