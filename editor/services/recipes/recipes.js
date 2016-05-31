angular.module('editor.services.recipes', ['angular-kinto'])
  .factory('recipes', function($kinto) {
    return $kinto.collection('recipes');
  });

