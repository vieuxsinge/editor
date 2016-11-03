angular.module('editor.filters.text', [])
  .filter('suffix', function() {
    return function(value, suffix) {
      if( !value ) { return; }
      return value + suffix;
    };
  });

