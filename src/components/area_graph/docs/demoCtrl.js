angular.module('amelia.docs.controllers').controller('obDateRangeAreaGraphControllerDemo', ['$scope', function($scope) {
  var update = function(){
    var data = [];
    var number = 20;
    var current = $scope.dates.startDate.clone().startOf('day');
    var endDate = $scope.dates.endDate.clone().startOf('day');
    if ($scope.dateType === 'month') {
      endDate = endDate.startOf('month').startOf('day');
      current = current.startOf('month').startOf('day');
    }

    while (current <= endDate) {
      data.push({
        value: number,
        date: current.format('M/D/YYYY')
      });

      if ($scope.dateType === 'month'){
        current.add('months', 1);
        current = current.startOf('month').startOf('day');
      }
      else {
        current.add('days', 1).startOf('day');
      }

      number = ~~(Math.random()*30);
    }

    $scope.clicks = [
      {
        name: 'TestPub1',
        values: data
      }
    ];

    $scope.ctr = [
      {
        name: 'TestPub1',
        values: data
      }
    ];
  };

  $scope.dateRanges = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
    'Last 7 Days': [moment().subtract('days', 6), moment()],
    'Last 30 Days': [moment().subtract('days', 29), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
  };

  $scope.maxDate = moment().add('day', 1).format('YYYY-MM-DD');

  $scope.dates = {
    startDate: moment().subtract('days', 1).startOf('day'),
    endDate: moment().startOf('day')
  };

  $scope.dateType = 'day';

  $scope.$watch('dates', update);
  $scope.$watch('dateType', update);
}]);

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

	setTimeout(function(){
		console.log('format')
		$scope.xAxisFormat = d3.time.format.multi([
			[".%L", function(d) { return d.getMilliseconds(); }],
			[":%S", function(d) { return d.getSeconds(); }],
			["%I:%M", function(d) { return d.getMinutes(); }],
			["%I %p %p", function(d) { return d.getHours(); }],
			//["%a %d", function(d) { return d.getDay() && d.getDate() !== 1; }],
			["%-m/%-d %d %d", function(d) { return d.getDate() !== 1; }],
			["%B hj", function(d) { return d.getMonth(); }],
			["%Y hjj", function() { return true; }]
		])
	}, 7000)

}]);

angular.module('amelia.docs.controllers').controller('obAreaGraphCustomTicksControllerDemo', ['$scope', function($scope) {
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
	}]




}]);