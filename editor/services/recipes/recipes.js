angular.module('editor.services.recipes', ['editor.services.kinto'])
  .factory('recipes', function($kinto) {
    return new $kinto.collection('recipes');
  });

