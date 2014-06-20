angular.module('amelia.docs.controllers').controller('tableDemoController', function($scope, $filter) {
  $scope.schema = [{
    key: 'date',
    name: 'Date',
    accessor: function(datum) {
      return new Date(datum.date);
    },
    display: function(value) {
      return $filter('date')(value, 'shortDate');
    },
    sortable: true,
    width: '2',
    totalLogic: 'range',
    defaultSort: 'desc'
  }, {
    key: 'title',
    name: 'Title',
    display: function(value) {
      return value;
    },
    sortable: true,
    width: '3',
    totalLogic: undefined,
    defaultSort: 'asc'
  }, {
    key: 'authors',
    name: 'Authors',
    display: function(value) {
      return value.join(', ');
    },
    sortable: true,
    width: '2',
    totalLogic: undefined,
    defaultSort: 'asc'
  }, {
    key: 'paid_clicks',
    name: 'Paid Clicks',
    display: function(value) {
      return $filter('number')(value, 0);
    },
    sortable: true,
    width: '2',
    totalLogic: 'sum',
    defaultSort: 'desc'
  }, {
    key: 'page_views',
    name: 'Page Views',
    display: function(value) {
      return $filter('number')(value, 0);
    },
    width: '2',
    sortable: true,
    totalLogic: 'sum',
    defaultSort: 'desc'
  }, {
    key: 'ctr',
    name: 'CTR',
    display: function(value) {
      return $filter('number')(value, 2) + '%';
    },
    width: '1',
    sortable: true,
    totalLogic: 'average',
    defaultSort: 'desc'
  }];

  // $scope.predicate = '-date';

  // $scope.showTotals = true;

  // $scope.expandable = true;

  // $scope.expandedTemplate = '<div ng-controller="obPieChartController">\
  //                       <ob-pie-chart ob-pie-chart-data="data"></ob-pie-chart>\
  //                   </div>';
  //                   
  $scope.expandedTemplate = '';

  $scope.data = [{
    date: new Date('3/7/2014'),
    title: "Hello Outbrain!",
    authors: ["Joe Shmo", "Barack Obama"],
    paid_clicks: 264645,
    page_views: 975524,
    ctr: 5.13
  }, {
    date: new Date('3/8/2014'),
    title: "That is one sweet design...",
    authors: ["Aaron Neeley"],
    paid_clicks: 87360,
    page_views: 474558,
    ctr: 3.13
  }, {
    date: new Date('3/9/2014'),
    title: "Do you think I'm sexy?",
    authors: ["Cody Nicholson"],
    paid_clicks: 87360,
    page_views: 54386788,
    ctr: 10.13
  }, {
    date: new Date('3/10/2014'),
    title: "No Sleep Till Brooklyn!",
    authors: ["TJ Lavelle", "Bill De Blasio"],
    paid_clicks: 87360,
    page_views: 7867838,
    ctr: 4.13
  }, {
    date: new Date('3/11/2014'),
    title: "Gold teeth and a curse for this town were all in my mouth.",
    authors: ["Shins"],
    paid_clicks: 87360,
    page_views: 35808,
    ctr: 87.13
  }, {
    date: new Date('3/12/2014'),
    title: "Triangles are my facorite shape, three points where two lines meet.",
    authors: ["Alt-J"],
    paid_clicks: 1646,
    page_views: 4345645,
    ctr: 52.13
  }];
});
