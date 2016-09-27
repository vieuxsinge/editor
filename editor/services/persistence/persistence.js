angular.module('editor.services.persistence', ['editor.data.recipes'])
  .provider('persistence', function() {
    var provider = this;

    // Kinto parameters
    provider.url = ''
    provider.username = '';
    provider.password = '';
    provider.bucket = 'default';
    
    provider.$get = function($rootScope, $q) {
      var factory = this;
      
      var kinto = new KintoClient(provider.url, {
        headers: {Authorization: "Basic " + btoa(provider.username + ':' + provider.password)}
      });
      var kbucket = kinto.bucket(provider.bucket);

      var persist = function(collection, name) {

        var kcollection = kbucket.collection(name);

        // Populate
        kcollection.listRecords().then(function(res) {
          $rootScope.$apply(function() {
            collection.items = res.data;
          });
        });

        // Save changes
        var needSave = false;
        $rootScope.$watch(function() {
          return collection.items;
        }, function(newItems, oldItems) {
          if( newItems === oldItems ) { return; }
          needSave = true;
        }, true);

        var saving = false;
        $rootScope.$watch(function() {
          return needSave && !saving;
        }, function(value) {
          if( !value ) { return; }
          saving = true;
          needSave = false;
          save(collection.items).catch(function() {
            $log.error("Failed to save, retrying...");
            needSave = true;
          }).finally(function() {
            saving = false;
          });
        });

        var popById = function(items, id) {
          var found;
          angular.forEach(items, function(item) {
            if( item.id == id ) {
              found = item;
            }
          });

          if( !found ) { return; }
          return items.splice(items.indexOf(found), 1)[0];
        };

        var detectChanges = function(newItems, oldItems) {
          var res = { added: [], removed: [], modified: [] };
          var oldItemsCopy = angular.copy(oldItems);
          angular.forEach(newItems, function(newItem) {
            var oldItem = popById(oldItemsCopy, newItem.id);
            if( !oldItem ) {
              res.added.push(newItem);
            }
            else if( !angular.equals(newItem, oldItem) ) {
              res.modified.push(newItem);
            }
          });
          res.removed = oldItemsCopy;
          return res;
        };

        var saved = [];
        var save = function(items) {
          var toBeSaved = angular.copy(items);
          var changes = detectChanges(toBeSaved, saved);

          return $q.when(kcollection.batch(function(batch) {
            angular.forEach(changes.added, function(item) {
              batch.createRecord(item);
            });
            angular.forEach(changes.removed, function(item) {
              batch.deleteRecord(item.id);
            });
            angular.forEach(changes.modified, function(item) {
              batch.updateRecord(item);
            });
          })).then(function() {
            saved = toBeSaved;
          });
        };

      };
      
      return {
        persist: persist
      };
    };
  });

