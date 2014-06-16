angular.module('amelia-ui.services', [])
  .service('obTimeService', function($timeout) {
    var timeout,
      obTimeObserverCallbacks = [],
      currentTime = new Date();

    var update = function() {
      currentTime = new Date();
      notifyObservers();
      timeout = $timeout(update, 1000);
    };
    timeout = $timeout(update, 1000);

    //register an observer
    this.registerObserverCallback = function(callback) {
      obTimeObserverCallbacks.push(callback);
      callback();
    };

    //call this when you know 'foo' has been changed
    var notifyObservers = function() {
      angular.forEach(obTimeObserverCallbacks, function(callback) {
        callback();
      });
    };

    this.currentTime = function() {
      return currentTime;
    };

  });
