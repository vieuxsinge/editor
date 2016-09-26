angular.module('editor.data.recipes', ['editor.services.collection'])
  .factory('recipes', function(Collection) {
    return new Collection();
  });

