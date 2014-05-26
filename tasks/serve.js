console.log('SERVE amelia-ui ...');

var src = require('./src');
var docs = require('./docs');

var path = require('path');
var connect = require('gulp-connect');
var Q = require('q');

Q.all([
	docs.html.build(),
	docs.css.build(),
	src.css.serve(),
	src.icons.serve()
])
.then(function () {

	connect.server({
		root: [path.resolve(__dirname, '..')],
		port: 1337,
		livereload: true,
		open: {
			file: 'docs/',
			browser: (process.platform === 'linux') ? 'google-chrome' : 'Google Chrome'
		},
		middleware: function (connect, options) {
			var mod_rewrite = require('connect-modrewrite');

	        var middlewares = [];

            middlewares.push(mod_rewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
            middlewares.push(connect.static('docs'));
            return middlewares;
	      }
	})();

	docs.html.watch(connect);
	docs.css.watch(connect);
	docs.js.watch(connect);

	src.css.watch(connect);
	src.js.watch(connect);
	src.html.watch(connect);
	src.icons.watch(connect);

});
