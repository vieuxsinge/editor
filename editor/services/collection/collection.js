angular.module('editor.services.collection', [])
  .factory('Collection', function($q) {
    return function() {
      var collection = this;

      var ids = 0;

      collection.items = [];

      collection.create = function(item) {
        if( !item.id ) {
          item.id = ids.toString();
          ids++;
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
        else {
          return $q.resolve(found);
        }
      };

      collection.remove = function(id) {
        return collection.get(id).then(function(item) {
          collection.items.splice(collection.items.indexOf(item), 1);
          return item;
        });
      };
      
    };
  });

