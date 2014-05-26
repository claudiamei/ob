angular.module('amelia.docs.controllers').controller('obPieChartController', function($scope, $interval){
  var testData = {
    '0': [{
      value : 4,
      key: 'A',
      testAccessor : {b:'AAA'},
      label : 'CNN.com'
    }, {
      value : 5,
      key: 'B',
      testAccessor : {b:'BBB'},
      label : 'aLongExampleNameSite.com'
    }, {
      value : 3,
      key: 'C',
      testAccessor : {b:'CCC'},
      label : 'C'
    }, {
      value : 4,
      key: 'D',
      testAccessor : {b:'DDD'},
      label : 'D'
    }, {
      value : 6,
      key: 'other',
      testAccessor : {b:'EEE'},
      label : 'E'
    }],
    '1': [{
      value : 4,
      key: 'A',
      label : 'CNN.com'
    }, {
      value : 8,
      key: 'B',
      label : 'aLongExampleNameSite.com'
    }, {
      value : 3,
      key: 'C',
      label : 'C'
    }, {
      value : 2,
      key: 'D',
      label : 'D'
    }, {
      value : 6,
      key: 'other',
      label : 'E'
    }],
    '2': [{
      value : 4,
      key: 'A',
      label : 'CNN.com'
    }, {
      value : 8,
      key: 'B',
      label : 'aLongExampleNameSite.com'
    }, {
      value : 2,
      key: 'other',
      label : 'E'
    }]
  };
  
  var otherData = [
      {label: 'A', value: 5},
      {label: 'B', value: 5},
      {label: 'C', value: 5},
      {label: 'D', value: 5},
      {label: 'E', value: 5},
      {label: 'F', value: 5},
      {label: 'G', value: 5}
  ];
  var i = 0;
 
  $interval(function(){
    if(i <3) {
      $scope.data = {
        'primaryData': testData[i],
        'otherData': otherData
      };
    }
    i = (i + 1) % 3 ;
  }, 5000);
  $scope.data = {
      'primaryData': testData[i],
      'otherData': otherData,
    };
});
