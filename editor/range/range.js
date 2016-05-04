angular.module('editor.range', ['ui.bootstrap'])
  .directive('range', function() {
    return {
      restrict: 'E',
      scope: {
        min: '=',
        max: '=',
        rangeMin: '=',
        rangeMax: '=',
        rangeMinLabel: '=',
        rangeMaxLabel: '=',
        value: '='
      },
      templateUrl: 'editor/range/range.html',
      link: function(scope) {
        var update = function() {
          var size = scope.max - scope.min;
          var rangeSize = scope.rangeMax - scope.rangeMin;
          scope.rangeLeft = Math.min((scope.rangeMin - scope.min) * 100 / size, 100);
          scope.rangeWidth = Math.min(rangeSize * 100 / size, 100-scope.rangeLeft);
          scope.valueLeft = Math.min((scope.value - scope.min) * 100 / size, 99);
        };
      
        scope.$watch('min', update);
        scope.$watch('max', update);
        scope.$watch('rangeMin', update);
        scope.$watch('rangeMax', update);
        scope.$watch('value', update);
      }
    };
  });
