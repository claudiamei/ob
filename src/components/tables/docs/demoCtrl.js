angular.module('amelia.docs.controllers').controller('tableDemoController', function($scope, $filter){
	$scope.schema = [{
		key: 'date',
		name: 'Date',
		accessor: function (datum) {return new Date(datum.date);},
		display: function (value) {
			return $filter('date')(value, 'shortDate');
		},
		sortable: true,
		width: '2',
		totalLogic: 'range'
	},{
		key: 'total_clicks',
		name: 'Total Clicks',
		display: function (value) {
			return $filter('number')(value, 0);
		},
		sortable: true,
		width: '2',
		totalLogic: undefined
	},{
		key: 'organic_clicks',
		name: 'Organic Clicks',
		display: function (value) {
			return $filter('number')(value, 0);
		},
		sortable: true,
		width: '2',
		totalLogic: undefined
	},{
		key: 'paid_clicks',
		name: 'Paid Clicks',
		display: function (value) {
			return $filter('number')(value, 0);
		},
		sortable: true,
		width: '2',
		totalLogic: undefined
	},{
		key: 'page_views',
		name: 'Page Views',
		display: function (value) {
			return $filter('number')(value, 0);
		},
		width: '2',
		sortable: true,
		totalLogic: undefined
	},{
		key: 'ctr',
		name: 'CTR',
		display: function (value) {
			return $filter('number')(value, 2) + '%';
		},
		width: '2',
		sortable: true,
		totalLogic: 'average'
	}];

	// $scope.hello = function () {
	// 	alert('test')
	// };

	$scope.predicate = '-date';

	$scope.showTotals = true;

	$scope.expandable = true;

	// $scope.expandedTemplate = "<div>Hello World!!</div>";

	$scope.expandedTemplate = '<div ng-controller="obPieChartController">\
                        <ob-pie-chart ob-pie-chart-data="data"></ob-pie-chart>\
                    </div>';

	$scope.data = [{
		date: new Date('3/7/2014'),
		total_clicks: 456456,
		organic_clicks: 43564,
		paid_clicks: 264645,
		page_views: 975524,
		ctr: 5.13
	},{
		date: new Date('3/8/2014'),
		total_clicks: 659735,
		organic_clicks: 42567,
		paid_clicks: 87360,
		page_views: 474558,
		ctr: 3.13
	},{
		date: new Date('3/9/2014'),
		total_clicks: 46537,
		organic_clicks: 6552,
		paid_clicks: 87360,
		page_views: 54386788,
		ctr: 10.13
	},{
		date: new Date('3/10/2014'),
		total_clicks: 4653294,
		organic_clicks: 69564,
		paid_clicks: 87360,
		page_views: 7867838,
		ctr: 4.13
	},{
		date: new Date('3/11/2014'),
		total_clicks: 43564,
		organic_clicks: 39754,
		paid_clicks: 87360,
		page_views: 35808,
		ctr: 87.13
	},{
		date: new Date('3/12/2014'),
		total_clicks: 1357,
		organic_clicks: 1217,
		paid_clicks: 1646,
		page_views: 4345645,
		ctr: 52.13
	}];
});