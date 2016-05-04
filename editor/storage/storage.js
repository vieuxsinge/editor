angular.module('editor.storage', [])
  .factory('storage', function() {
    return new Kinto();
  });

