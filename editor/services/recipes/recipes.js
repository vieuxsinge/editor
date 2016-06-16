angular.module('editor.services.recipes', ['editor.services.collection'])
  .factory('recipes', function(Collection) {
    return new Collection();
  });

