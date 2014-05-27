var path = require('path');
var Q = require('q');
var gulp = require('gulp');
var tasks = require('gulp-load-plugins')();

var utils = require('../utils');

var serve = {
	index: function index () {
		var readme = path.join('README.md'),
			template = path.join('docs', 'pages', 'main', 'main.tpl.html'),
			output_to = path.join('docs', '.tmp');
		return gulp.src(readme)
			.pipe(tasks.markdown())
			.pipe(tasks.wrap({'src' : template}))
			.pipe(tasks.rename('main.html'))
			.pipe(gulp.dest(output_to));
	},
	components_list: function components () {
		var components = path.join('src', '**', 'docs', '*.html'),
			template = path.join('docs', 'pages', 'components', 'component_list.tpl.html'),
			output_to = path.join('docs', '.tmp');
		return gulp.src(components)
			.pipe(tasks.wrap({'src' : template}, {}, { variable: 'demo' } ))
			.pipe(tasks.concat('component_list.html'))
			.pipe(gulp.dest(output_to));
		// var components = path.join('src', '*', 'docs', '*.html'),
		// 	output_to = path.join('docs', '.tmp');
		// return gulp.src(components)
		// 	.pipe(tasks.concat('components.html'))
		// 	.pipe(gulp.dest(output_to));
	},
	components_demos: function components () {
		var components = path.join('src', '**', 'docs', '*.html'),
			template = path.join('docs', 'pages', 'components', 'demo-component.tpl.html'),
			output_to = path.join('docs', '.tmp');
		return gulp.src(components)
			.pipe(tasks.wrap({'src' : template}, {}, { variable: 'demo' } ))
			.pipe(tasks.concat('components.html'))
			.pipe(gulp.dest(output_to));
		// var components = path.join('src', '*', 'docs', '*.html'),
		// 	output_to = path.join('docs', '.tmp');
		// return gulp.src(components)
		// 	.pipe(tasks.concat('components.html'))
		// 	.pipe(gulp.dest(output_to));
	}
};

module.exports = {
	build: function () {
		var tasks = [serve.index, serve.components_list, serve.components_demos];
		return utils.run_tasks(__filename, tasks);
	},
	watch: function (connect) {
		var index = path.join('README.md'),
			main_tpl = path.join('docs', 'pages', 'main', 'main.tpl.html');
		gulp.watch([index, main_tpl], function (event) {
			var tasks = [serve.index];
			utils.run_tasks(__filename, tasks).then(function () {
				utils.reload(connect, event.path);
			});
		});

		var demo_files = path.join('docs', '*', 'docs', 'demo.html'),
			demo_files = path.join('src', '**', 'package.json'),
			templates = path.join('docs', 'pages', '**', '*.html');
		gulp.watch([demo_files, templates], function (event) {
			var tasks = [serve.components_list, serve.components_demos];
			utils.run_tasks(__filename, tasks).then(function () {
				utils.reload(connect, event.path);
			});
		});
	}
}