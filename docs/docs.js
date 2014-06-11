var app = angular.module('amelia.docs', [
	'ngRoute',
	'ngTable',
  'ngBootstrap',
	'hljs',
	'amelia.docs.components',
	'amelia.docs.controllers',
	'amelia-ui',
    'duScroll'
]);

// window.onerror = function (errorMsg, url, lineNumber, columnNumber, errorObject) {
//     var errMsg;
//     //check the errorObject as IE and FF don't pass it through (yet)
//     if (errorObject && errorObject !== undefined) {
//             errMsg = errorObject.message;
//         }
//         else {
//             errMsg = errorMsg;
//         }
//     alert('Error: ' + errMsg);
// };

// var throwError = function () {
//     throw new Error(
//     'Something went wrong. Something went wrong. Something went wrong. Something went wrong. ' +
//     'Something went wrong. Something went wrong. Something went wrong. Something went wrong. ' + 
//     'Something went wrong. Something went wrong. Something went wrong. Something went wrong. ' + 
//     'Text does not get truncated! :-)');
// };

app.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(false);

	$routeProvider
	.when('/', {
		templateUrl: './.tmp/main.html'
	})
	.when('/components/:component?', {
		templateUrl: 'pages/components/components.html',
		controller: 'ComponentController'
	})
	.when('/report_demo', {
		templateUrl: 'pages/report_demo/index.html'
	})
	.when('/icons', {
		templateUrl: 'pages/icons/index.html'
	})
	.when('/faq', {
		templateUrl: 'faq/faq.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});

angular.module('amelia.docs.controllers', []);

angular.module('amelia.docs').run(function($rootScope, $location) {
    $rootScope.isActive = function (viewLocation) {
    	return viewLocation === $location.path();
    };
});
