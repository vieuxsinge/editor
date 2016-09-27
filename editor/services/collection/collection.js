angular.module('editor.services.collection', ['uuid4'])
  .factory('Collection', function($q, uuid4) {
    return function() {
      var collection = this;

      collection.items = [];

      collection.create = function(item) {
        if( !item.id ) {
          item.id = uuid4.generate();
        }
        collection.items.push(item);
        return $q.resolve(item);
      };
      
      collection.get = function(id) {
        var found;
        
        angular.forEach(collection.items, function(item) {
          if( item.id == id ) {
            found = item;
          }
        });
        
        if( !found ) {
          return $q.reject();
        }

        return $q.resolve(found);
      };

      collection.remove = function(id) {
        return collection.get(id).then(function(item) {
          collection.items.splice(collection.items.indexOf(item), 1);
          return item;
        });
      };
      
    };
  });

