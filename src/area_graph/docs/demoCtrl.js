angular.module('amelia.docs.controllers').controller('obAreaGraphControllerDemo', ['$scope', function($scope) {
	$scope.data = [{
		name: 'TestPub1',
		values: [{
			value : 100,
			date: '4/5/2014',
		}, {
			value : 150,
			date: '4/8/2014',
		}, {
			value : 125,
			date: '4/11/2014',
		}]
	},{
		name: 'TestPub2',
		values: [{
			value : 130,
			date: '4/5/2014',
		}, {
			value : 50,
			date: '4/8/2014',
		}, {
			value : 15,
			date: '4/11/2014',
		}]
	},{
		name: 'TestPub3',
		values: [{
			value : 180,
			date: '4/5/2014',
		}, {
			value : 10,
			date: '4/8/2014',
		}, {
			value : 115,
			date: '4/11/2014',
		}]
	}];
}]);