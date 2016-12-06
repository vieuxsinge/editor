angular.module('editor.services.projects', ['editor.services.kinto'])
  .factory('projects', function(collectionWrapper) {
    return function(id) {
      return {
        id: id,
        recipes: collectionWrapper(id, 'recipes'),
        ingredients: collectionWrapper(id, 'ingredients'),
        equipments: collectionWrapper(id, 'equipments')
      };
    };
  })
  .factory('collectionWrapper', function(kinto) {
    return function(bucketId, name) {
      var collection = function() {
        return kinto.get().bucket('beer-editor-' + bucketId).collection(name);
      };

      return {
        list: function() {
          return collection().listRecords().then(function(res) {
            return res.data;
          });
        },
        create: function(item) {
          return collection().createRecord(item).then(function(res) {
            return res.data;
          });
        },
        update: function(item) {
          return collection().updateRecord(item).then(function(res) {
            return res.data;
          });
        },
        get: function(itemId) {
          return collection().getRecord(itemId).then(function(res) {
            return res.data;
          });
        },
        delete: function(itemId) {
          return collection().deleteRecord(itemId).then(function(res) {
            return res.data;
          });
        }
      };
    };
  });
