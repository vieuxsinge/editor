angular.module('editor.data.styles', [])
  .factory('styles', function($http) {
    var styles = {};
    $http.get('resources/styles.json').then(function(resp) {
      Object.assign(styles, resp.data['styleguide']['class'][0]['category']);
    });
    return styles;
  });

