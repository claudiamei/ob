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
}]);

angular.module('amelia.docs.controllers').controller('obAreaGraphAxisControllerDemo', ['$scope', '$interval', function($scope, $interval) {
	$scope.data = [{
		name: 'TestPub1',
		values: [{
			value : 100,
			date: '1/5/2014',
		}, {
			value : 150,
			date: '1/10/2014',
		}, {
			value : 125,
			date: '1/15/2014',
		}]
	}];

	var dataSets = [{
		xAxisTickValues: [new Date('1/5/2014'), new Date('1/15/2014')],
		xAxisFormat: d3.time.format.multi([
			["%I %p", function(d) { return d.getHours(); }],
			["%a/%-d", function(d) { return d.getDate() !== 1; }],
			["%B", function(d) { return d.getMonth(); }],
			["%Y", function() { return true; }]
		]),
		data: [{
			name: 'TestPub1',
			values: [{
				value : 100,
				date: '1/5/2014',
			}, {
				value : 150,
				date: '1/10/2014',
			}, {
				value : 125,
				date: '1/15/2014',
			}]
		}],
	},{
		xAxisTickValues: [new Date('2/5/2014'), new Date('1/8/2014'), new Date('1/10/2014'), new Date('1/12/2014'), new Date('1/15/2014')],
		xAxisFormat: d3.time.format.multi([
			["%I %p", function(d) { return d.getHours(); }],
			["%-m/%-d", function(d) { return d.getDate() !== 1; }],
			["%B", function(d) { return d.getMonth(); }],
		]),
		data: [{
			name: 'TestPub1',
			values: [{
				value : 100,
				date: '1/1/2014',
			}, {
				value : 125,
				date: '2/1/2014',
			}]
		}],
	},{
		xAxisTickValues: [new Date('2/1/2014'), new Date('3/1/2014')],
		xAxisFormat: d3.time.format("%B"),
		data: [{
			name: 'TestPub1',
			values: [{
				value : 300,
				date: '2/1/2014',
			}, {
				value : 225,
				date: '3/1/2014',
			}]
		}],
	}];

	var i = 0;
	$interval(function(){
		if(i <3) {
			$scope.xAxisTickValues = dataSets[i].xAxisTickValues;
			$scope.xAxisFormat = dataSets[i].xAxisFormat;
			$scope.data = dataSets[i].data;
		}
		i = (i + 1) % 3 ;
	}, 5000);
}]);