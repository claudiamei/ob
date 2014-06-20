/* global angular, $ */

angular.module('amelia-ui.kpi-boxes', ['amelia-ui.utils', 'ui.bootstrap.tooltip', 'ngSanitize'])
  .filter('obNumber', function($filter) {
    var numberFilter = $filter('number');
    return function(number, decimalPlaces) {
      var toRound = Math.round(number) !== Number(number);
      if (!decimalPlaces && decimalPlaces !== 0) {
        decimalPlaces = 2;
      }
      return numberFilter(number, toRound ? decimalPlaces : 0);
    };
  })
  .filter('kpiNumberTooltip', function($filter) {
    return function(number, decimalPlaces, maxDigits) {
      maxDigits = maxDigits || 3;
      var digits = Math.abs(Math.round(number)).toString().length;
      if (digits > maxDigits) {
        return $filter('obNumber')(number, decimalPlaces);
      }
    };
  })
  .filter('kpiNumberRevenue', function($filter) {
    var numberFilter = $filter('kpiNumber');
    return function(number) {
      var digits = Math.abs(Math.round(number)).toString().length;
      var decimalPoints = 2;
      if (digits > 4) {
        decimalPoints = 0;
      }
      return numberFilter(number, decimalPoints, 4);
    };
  })
  .filter('kpiNumber', function($filter) {
    // suffixes for thousand, million, billion, etc.
    var suffixes = ['', 'K', 'MM', 'BN', 'MT'];
    return function(number, decimalPlaces, maxDigits, skipRounding) {
      maxDigits = maxDigits || 3;
      var digits = Math.abs(Math.round(number)).toString().length;
      var multiple = 0;
      if (digits > maxDigits) {
        if (!decimalPlaces && decimalPlaces !== 0) {
          decimalPlaces = 2;
        }
        multiple = Math.floor((digits - 1) / 3);
        number = number / Math.pow(1000, multiple);
      } else if (skipRounding) {
        decimalPlaces = 0;
      }

      return $filter('obNumber')(number, decimalPlaces) + '<span class="kpi-suffix">' + suffixes[multiple] + '</span>';
    };
  })
  .directive('obKpiNumber', function() {
    return {
      restrict: 'EA',
      // replace: true,
      scope: {
        percentage: '=',
        currency: '=',
        data: '=',
      },
      templateUrl: '../src/components/kpi/templates/kpi-number.html',
      link: function(scope, element) {
        var init = false,
          changeSiSuffix = {
            'k': 'K',
            'M': 'MM',
            'G': 'BN',
          },
          d3 = window.d3,
          formatPrefix,
          kpiValue = d3.select(element[0]).select('.value'),
          kpiSuffix = d3.select(element[0]).select('.suffix'),
          newValue,
          oldValue,
          currentTween;

        scope.$watch('data', function(newData, oldData) {

          if (typeof(newData) === 'number') {
            newValue = newData;
            oldValue = oldData;
          } else {
            newValue = newData.value;
            oldValue = oldData.value;
          }

          if (!init) {
            oldValue = 0;
            animateText();
            init = !init;
            return;
          }
          if (newValue !== oldValue) {
            animateText();
          }

        }, true);

        function animateText() {
          if (scope.percentage) {
            currentTween = tweenPercentageText;
            oldValue *= 100;
            newValue *= 100;
            scope.data.valueSuffix = '';
            scope.data.suffix = '%';
          } else {
            currentTween = tweenValueAndSuffixText;
          }

          kpiValue
            .transition()
            .duration(init ? 7000 : 2000)
            .ease("exp-in-out")
            .tween("text", currentTween);
        }

        function tweenValueAndSuffixText() {
          var i = d3.interpolate(oldValue, newValue);
          return function(t) {
            if (i(t) < 1000) {
              this.textContent = ~~i(t);
              kpiSuffix.text('');
              return;
            }
            formatPrefix = d3.formatPrefix(i(t));
            kpiSuffix.text(changeSiSuffix[formatPrefix.symbol]);
            this.textContent = formatPrefix.scale(i(t)).toFixed(1);
          };
        }

        function tweenPercentageText() {
          var i = d3.interpolate(oldValue, newValue);
          return function(t) {
            this.textContent = d3.format('.2f')(i(t));
          };
        }
      }
    };
  })
  .directive('kpioverPopup', function($timeout) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        title: '@',
        content: '@',
        placement: '@',
        animation: '&',
        isOpen: '&'
      },
      templateUrl: '../src/components/kpi/templates/popover.html',
      link: function($scope, el) {
        $timeout(function() {
          (function registerBodyClick() {
            $('html').one('click', function(e) {
              var btnHelp = $('.ob-help');
              //check if clicked on button
              if (e.target === btnHelp[0]) {
                return;
              }

              //check if clicked on popover.html
              if ($.contains(el[0], e.target)) {
                registerBodyClick();
                return;
              }

              btnHelp.click();
            });
          })();
        }, 0);
      }
    };
  })
  .directive('kpiover', ['$tooltip',
    function($tooltip) {
      return $tooltip('kpiover', 'popover', 'click');
    }
  ])
  .directive('obKpiBoxEngageDashboard', function() {
    return {
      restrict: 'AE',
      templateUrl: '../src/components/kpi/templates/engage-dashboard.html',
      replace: true,
      transclude: true,
      scope: {
        boxes: '=',
        currency: '@'
      },
      controller: ['$scope',
        function($scope) {
          if ($scope.boxes.ctr && $scope.boxes.ctr.value) {
            $scope.boxes.ctr.value = Math.round(Number($scope.boxes.ctr.value) * 10000) / 100;
          }
        }
      ]
    };
  })
  .directive('obKpiBoxAmplifyDashboard', function() {

    var link = function($scope) {
      var kpiBoxes = $scope.boxes;

      $scope.setKpiView = function(view) {
        view = view || 'mtd';
        $scope.view = view;
        $scope.boxView = kpiBoxes[view];
      };
      $scope.setKpiView();
    };

    return {
      restrict: 'AE',
      templateUrl: '../src/components/kpi/templates/amplify-dashboard.html',
      replace: true,
      transclude: true,
      link: link,
      scope: {
        boxes: '=',
        currency: '@'
      }
    };
  })
  .directive('obKpiBoxEditorialRecommend', function() {
    return {
      restrict: 'AE',
      templateUrl: '../src/components/kpi/templates/editorial-recommend.html',
      replace: true,
      //  transclude: true,
      //      scope: {
      //        boxes: '=',
      //        currency: '@'
      //      }
    };
  })
  .directive('obKpiBoxEditorialContent', function() {
    return {
      restrict: 'AE',
      templateUrl: '../src/components/kpi/templates/editorial-content.html',
      replace: true,
      transclude: true,
      //scope: {
      //kpi_data : '=',
      // currency: '@'
      // }
    };
  })
  .directive('obKpiBoxEditorialContentDemo', function() {
    return {
      restrict: 'AE',
      templateUrl: '../src/components/kpi/templates/editorial-content-demo.html',
      replace: true,
      transclude: true,
      //scope: {
      //kpi_data : '=',
      // currency: '@'
      // }
    };
  })
  .directive('obKpiBoxEditorialFrontpage', function() {
    return {
      restrict: 'AE',
      templateUrl: '../src/components/kpi/templates/editorial-frontpage.html',
      replace: true,
      transclude: true,
      scope: {
        boxes: '=',
        currency: '@'
      }
    };
  })
  .directive('obKpiBoxEditorialSocial', function() {
    return {
      restrict: 'AE',
      templateUrl: '../src/components/kpi/templates/editorial-social.html',
      replace: true,
      transclude: true,
      scope: {
        boxes: '=',
        currency: '@'
      }
    };
  });
