angular.module('editor.filters.recipe', [])
  .filter('abv', function($filter) {
    return function(value) {
      return $filter('number')(value, 1) + ' %';
    };
  })
  .filter('color', function($filter) {
    return function(value) {
      return $filter('number')(value, 0) + ' EBC';
    };
  })
  .filter('density', function($filter) {
    return function(value) {
      return $filter('number')(value, 3);
    };
  })
  .filter('efficiency', function($filter) {
    return function(value) {
      return $filter('number')(value, 0) + ' %';
    };
  })
  .filter('ibu', function($filter) {
    return function(value) {
      return $filter('number')(value, 0) + ' IBU';
    };
  })
  .filter('volume', function($filter) {
    return function(value) {
      return $filter('number')(value, 0) + ' L';
    };
  })
  .filter('cssColor', function() {
    return function(ebc) {
      var srm = ebc / 1.97;
      var r = Math.round(Math.min(255, Math.max(0, 255 * Math.pow(0.975, srm))));
      var g = Math.round(Math.min(255, Math.max(0, 245 * Math.pow(0.88, srm))));
      var b = Math.round(Math.min(255, Math.max(0, 220 * Math.pow(0.7, srm))));
      return 'rgb('+r+','+g+','+b+')';
    };
  });

