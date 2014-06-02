angular.module('amelia.docs.controllers').controller('obTimelineGraphControllerDemo', function($scope, $interval) {
	$scope.data = [{
		name: 'Timeline1',
		values: [{
			value : 4,
			date: '4/5/2014',
		}, {
			value : 5,
			date: '4/6/2014',
		}, {
			value : 7,
			date: '4/7/2014',
		},{
			value : 7,
			date: '4/8/2014',
		},{
			value : 7,
			date: '4/9/2014',
		}]
	},{
		name: 'TestPub2',
		values: [{
			value : 3,
			date: '4/5/2014',
		}, {
			value : 5,
			date: '4/6/2014',
		}, {
			value : 7,
			date: '4/7/2014',
		},{
			value : 7,
			date: '4/8/2014',
		},{
			value : 7,
			date: '4/9/2014',
		}]
	},{
		name: 'TestPub3',
		values: [{
			value : 8,
			date: '4/5/2014',
		}, {
			value : 4,
			date: '4/6/2014',
		}, {
			value : 2,
			date: '4/7/2014',
		},{
			value : 12,
			date: '4/8/2014',
		},{
			value : 3,
			date: '4/9/2014',
		}]
	}];

	var dates = ['4/5/2014', '4/6/2014', '4/7/2014', '4/8/2014', '4/9/2014'];

	$interval(function(){
		var data = [], row = {}, values = [];
		$scope.data.forEach(function(d){ //create rows with random values
			row = {};
			row.name = d.name;
			row.values = [];
			for(var i = 0; i < 5; i++){
				row.values.push({
					value: ~~(Math.random()*20),
					date: dates[i],
				});
			}
			data.push(row);
		});
		$scope.data = data;
	}, 8000);
});