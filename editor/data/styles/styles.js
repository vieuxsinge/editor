angular.module('editor.data.styles', [])
  .factory('styles', function($http) {
    var styles = {};
    $http.get('resources/styleguide-2015.json').then(function(resp) {
      Object.assign(styles, resp.data['styleguide']['class'][0]['category']);
    });
    return styles;
  });

