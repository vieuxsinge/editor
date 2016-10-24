angular.module('editor.data.equipments', ['editor.services.collection'])
  .factory('equipments', function(Collection) {
    return new Collection();
  });

