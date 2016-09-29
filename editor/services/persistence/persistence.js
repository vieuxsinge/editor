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

      return new (function() {
        var service = this;

        var states = [];

        var initDeferred = $q.defer();

        $rootScope.$watch(function() {
          return states.reduce(function(value, state) {
            return value && state.initialized;
          }, true);
        }, function(initialized) {
          if( !initialized ) { return; }
          initDeferred.resolve();
        });

        var init = function() {
          return initDeferred.promise;
        };

        service.persist = function(collection, name) {

          var state = {
            initialized: false,
            needSave: false,
            saving: false,
            saved: null
          };
          states.push(state);

          var kcollection = kbucket.collection(name);

          // Populate
          kcollection.listRecords().then(function(res) {
            $rootScope.$apply(function() {
              collection.items = res.data;
              state.initialized = true;
            });
          });

          // Save changes
          $rootScope.$watch(function() {
            return collection.items;
          }, function(newItems, oldItems) {
            if( newItems === oldItems ) { return; }
            state.needSave = true;
          }, true);

          $rootScope.$watch(function() {
            return state.needSave && !state.saving;
          }, function(value) {
            if( !value ) { return; }
            state.saving = true;
            state.needSave = false;
            save(collection.items).catch(function() {
              $log.error("Failed to save, retrying...");
              state.needSave = true;
            }).finally(function() {
              state.saving = false;
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
            var oldItemsCopy = angular.copy(oldItems) || [];
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

          var save = function(items) {
            var toBeSaved = angular.copy(items);
            var changes = detectChanges(toBeSaved, state.saved);

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
              state.saved = toBeSaved;
            });
          };

          // Patch collection
          var originalGet = collection.get;
          collection.get = function(id) {
            return init().then(function() {
              return originalGet.bind(collection)(id);
            });
          };

        };
      })();
    };
  });

