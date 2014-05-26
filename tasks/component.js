var gulp = require('gulp');
var path = require('path');
var tasks = require('gulp-load-plugins')();

var utils = require('./utils');

var add = {
	copy_structure: function (component_name) {
		return function copy_structure () {
			return gulp.src(path.join('tasks', 'component_template', '**', '*'))
				.pipe(tasks.rename(function (path) {
					if (path.basename === 'component') {
						path.basename = component_name;
					}
				}))
				.pipe(gulp.dest(path.join('src', component_name)));
		};
	},
	add_amelia_js_dependencies: function (component_name) {
		return function add_amelia_js_dependencies () {
			return gulp.src(path.join('src', 'amelia-ui.js'))
				.pipe(tasks['angular-extender']({
					'amelia-ui': ['amelia-ui.' + component_name]
				}))
				.pipe(gulp.dest(path.join('src')));
		}
	},
	add_amelia_less_dependencies: function (component_name) {
		return function add_amelia_less_dependencies () {
			return gulp.src(path.join('src', 'amelia-ui.less'))
				.pipe(tasks.inject(gulp.src(path.join('src', component_name, component_name + '.less')), {read: false}, {
					starttag: '// start:inject:components',
					endtag: '// end:inject',
					transform: function (filepath, file, i, length) {
						console.log(filepath);
						return '  "' + filepath + '"' + (i + 1 < length ? ',' : '');
					}}))
				.pipe(gulp.dest(path.join('.tmp')));
		}
	},
	add_docs_imports: function () {

	}
};

module.exports = {
	add: function (component_name) {
		console.log("ADDING " + component_name);
		var tasks = [
			add.copy_structure(component_name),
			// add.add_amelia_js_dependencies(component_name),
			add.add_amelia_less_dependencies(component_name)
			];
		return utils.run_tasks(__filename, tasks);
	},
	remove: function (component_name) {
		console.log("REMOVING " + component_name)
	}
}