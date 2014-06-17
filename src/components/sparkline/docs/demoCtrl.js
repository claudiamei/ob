angular.module('amelia.docs.controllers')

.controller('obSparklineControllerDemo', function($scope, $interval) {

  function getRandomPoint(i){
    return {
      date: (new Date(1403023324266 + i * 60000 * 24)),
      value: ~~(Math.random() * 20),
    };
  }
  var data = [];
  for(var i = 0; i < 20; i++){
    data.push(getRandomPoint(i));
  }

  $scope.data = data;

  $interval(function() {
    data.shift();
    data.push(getRandomPoint(i));
    i++;
    $scope.data = data;
  }, 5000);
})

.controller('SparklineTableControllerDemo', function($scope, $filter) {

  $scope.showTotals = false;
  $scope.expandable = false;

  $scope.schema = [{
    key: 'title',
    name: 'Title',
    display: function(value) {
      return value;
    },
    sortable: true,
    width: '4',
    totalLogic: undefined,
    defaultSort: 'asc'
  }, {
    key: 'authors',
    name: 'Authors',
    display: function(value) {
      return value.join(', ');
    },
    sortable: true,
    width: '4',
    totalLogic: undefined,
    defaultSort: 'asc'
  }, {
    key: 'pageViews',
    name: 'Views/HR',
    display: function(value) {
      return $filter('number')(value, 0);
    },
    width: '2',
    sortable: true,
    totalLogic: 'sum',
    defaultSort: 'desc'
  },{
    key: 'paidClicks',
    name: '',
    display: function(){
      return '<ob-sparkline ng-controller="obSparklineControllerDemo" ob-sparkline-options="{margin: {left: 5, top: 5, right: 5, bottom: 5}, height:20}" data="data"></ob-sparkline>';
    },
    sortable: true,
    width: '2',
    totalLogic: 'sum',
    defaultSort: 'desc'
  }];

  $scope.data = [{
    date: new Date('3/7/2014'),
    title: "Hello Outbrain!",
    authors: ["Joe Shmo", "Barack Obama"],
    paidClicks: 264645,
    pageViews: 975524,
    ctr: 5.13
  }, {
    date: new Date('3/8/2014'),
    title: "That is one sweet design...",
    authors: ["Aaron McNeeley"],
    paidClicks: 87360,
    pageViews: 474558,
    ctr: 3.13
  }];

});

