angular.module('editor.services.collection', [])
  .factory('Collection', function($q) {
    return function() {
      var self = this;

      var items = [];
      this.list = function() {
        return $q.resolve(items);
      };

      this.get = function(itemId) {
        return self.list().then(function(items) {
          var foundItem = items.find(function(item) {
            return item.id == itemId;
          });
          if( !foundItem ) {
            return $q.reject();
          }
          return foundItem;
        });
      };

      var createId = function(newItem) {
        return self.list().then(function(items) {
          var maxId = -1;
          angular.forEach(items, function(item) {
            maxId = Math.max(item.id, maxId);
          });
          return maxId + 1;
        });
      };

      var create = function(newItem) {
        return createId(newItem).then(function(id) {
          newItem.id = id;
          items.push(newItem);
        });
      };

      var update = function(savedItem, newItem) {
        if(savedItem !== newItem) {
          //TODO Copy
          return $q.reject();
        }
        return $q.resolve();
      };

      this.save = function(item) {
        if( !item ) {
          return $q.reject();
        }

        return self.get(item.id).then(
          function(savedItem) { return update(savedItem, item); },
          function() { return create(item); }
        );
      };
      
      this.remove = function(itemId) {
        return self.list().then(function(items) {
          var index = items.findIndex(function(item) {
            return item.id == itemId;
          });
          if( index < 0 ) {
            return $q.reject();
          }
          items.splice(index, 1);
        });
      };

    };
  });

