var Q = require('q');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var path = require('path');

module.exports = {
  reload: function(connect, files) {
    gulp.src(files).pipe(connect.reload());
  },
  run_tasks: function(calledBy, tasks) {
    var deferred = Q.defer();
    var sub_tasks = function(tasks) {
      try {
        var task = tasks[0];
        var label = path.basename(calledBy) + ' -> ' + task.name;
        console.time(label);
        task().on('end', function() {
          console.timeEnd(label);
          tasks.shift();
          sub_tasks(tasks);
        });
      } catch (e) {
        deferred.resolve();
      }
    }
    sub_tasks(tasks);
    return deferred.promise;
  },
  add_banner: function(obj) {
    var new_obj = {};
    for (var method in obj) {
      if (obj.hasOwnProperty(method)) {
        new_obj[method] = function() {
          console.log(method);
          return obj[method]();
        }
      }
    }
    return new_obj;
  }
}
