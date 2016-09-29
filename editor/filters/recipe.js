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
  });

