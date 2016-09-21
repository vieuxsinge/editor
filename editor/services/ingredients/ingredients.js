angular.module('editor.services.ingredients', [])
  .factory('ingredients', function($http) {
    var service = {};
    
    $http.get('resources/yeast.json').then(function(response) {
      service.yeast = response.data;
    });

    $http.get('resources/others.json').then(function(response) {
      service.others = response.data;
    });

    $http.get('resources/hops.json').then(function(response) {
      service.hops = response.data;
    });

    $http.get('resources/fermentables.json').then(function(response) {
      service.fermentables = response.data;
    });

    return service;
  });

