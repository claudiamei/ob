var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();
var map = require('map-stream');

var utils = require('../utils');

var reporter = require('jshint-stylish');
var jshintRc = require('../../jshintrc.json');

// var files = {
// 	docs: {},
// 	src: {
// 		app: path.join('src', 'amelia-ui.js'),
// 		components: path.join('src', '*', '*.js'),
// 		templates: path.join('src', '**', '*.html')
// 	},
// 	dist: {
// 		path: 'dist',
// 		ob: {
// 			raw: {
// 				name: 'amelia-ui.js',
// 				path: path.join('dist', 'amelia-ui.js')
// 			},
// 			min: {
// 				name: 'amelia-ui.min.js',
// 				path: path.join('dist', 'amelia-ui.min.js')
// 			}
// 		},
// 		without_templates: {
// 			raw: {
// 				name: 'amelia-ui-without-templates.js',
// 				path: path.join('dist', 'amelia-ui-without-templates.js')
// 			},
// 			min: {
// 				name: 'amelia-ui-without-templates.min.js',
// 				path: path.join('dist', 'amelia-ui-without-templates.min.js')
// 			}
// 		},
// 		templates: {
// 			name: 'amelia-ui-templates.js',
// 			path: path.join('dist', 'amelia-ui-templates.js')
// 		}
// 	}
// };

var raw_output = 'amelia-ui.js';
var min_output = 'amelia-ui.min.js';

var component_js = function component_js () {
	var app = path.join('src', 'amelia-ui.js');
	var components = path.join('src', 'components', '*', '*.js');
	return gulp.src([app, components])
		.pipe(tasks.ngmin())
		.pipe(tasks.concat(raw_output))
		.pipe(gulp.dest('dist'))
		.pipe(tasks.uglify())
		.pipe(tasks.concat(min_output))
		.pipe(gulp.dest('dist'));
};

var component_templates = function component_templates () {
	var templates = [path.join('src', '**', '*.html'), path.join('!src', '**', 'docs', 'demo.html')];
	var output = 'amelia-ui.tpl.js';
	return gulp.src(templates)
		.pipe(tasks.htmlmin({
			collapseWhitespace: true
		}))
		.pipe(tasks.ngHtml2js({
			moduleName: "amelia-ui.templates",
			prefix: "../src/"
		}))
		.pipe(tasks.uglify())
		.pipe(tasks.concat(output))
		.pipe(gulp.dest('dist'));
};

var component_template_dependency = function component_template_dependency (mode) {
	var output = (mode === 'raw') ? raw_output : min_output;
	return function component_template_dependency () {
		return gulp.src(path.join('dist', output))
			.pipe(tasks.angularExtender({
				'amelia-ui': ['amelia-ui.templates']
			}))
			.pipe(tasks.rename(output))
			.pipe(gulp.dest('dist'));
	};
};

var component_template_concat = function component_template_concat (mode) {
	var output = (mode === 'raw') ? raw_output : min_output;
	var template = path.join('dist', 'amelia-ui.tpl.js');
	return function component_template_concat () {
		return gulp.src([path.join('dist', output), template])
			.pipe(tasks.concat(output))
			.pipe(gulp.dest('dist'));
	}
};

var clean = function clean () {
	files_to_clean = [path.join('dist', 'amelia-ui.tpl.js')];
	return gulp.src(files_to_clean)
		.pipe(tasks.clean());
};

var test = {
	hint: function hint () {
		var js_files = path.join('docs', '**', '*.js'),
			ignore = path.join('docs', 'lib', '**', '*');
		return gulp.src([js_files, '!'+ignore])
			.pipe(tasks.jshint(jshintRc))
			.pipe(tasks.jshint.reporter(reporter))
			// .pipe(jshint.reporter('fail'));
	},
	units: function units () {
		var angular = path.join('docs', 'lib', 'angular', 'angular.js');
		var angular_mocks = path.join('docs', 'lib', 'angular-mocks', 'angular-mocks.js');
		var bootstrap_ui = path.join('docs', 'lib', 'angular-bootstrap', 'ui-bootstrap-tpls.js');
		return gulp.src([
				angular,
				angular_mocks,
				bootstrap_ui,
				path.join('src', '**', '*.js'),
				'!'+path.join('src', '**', 'docs', '*.js'),
				'!'+path.join('src', 'lib', '**'),
				path.join('src', '**', 'tests', 'unit.js')
			])
			.pipe(tasks.karma({
				configFile: 'karma.conf.js',
				action: 'run'
			}))
			.on('error', function (err) {
				throw err;
			});
	}
}

module.exports = {
	build: function () {
		var tasks = [
			component_js,
			component_templates,
			component_template_dependency('raw'),
			component_template_dependency('min'),
			component_template_concat('raw'),
			component_template_concat('min'),
			clean
			];
		return utils.run_tasks(__filename, tasks);

	},

	test: function () {
		var tasks = [test.hint, test.units];
		return utils.run_tasks(__filename, tasks);
	},

	watch: function (connect) {
		var js_files = path.join('src', '**', '*.js');
		var tasks = [test.hint];
		gulp.watch([js_files], function (event) {
			utils.run_tasks(__filename, tasks).done(function () {
				utils.reload(connect, event.path);
			});
		});
	}
};