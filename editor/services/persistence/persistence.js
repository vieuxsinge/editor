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
        var createState = function() {
          var state = {
            initialized: false,
            needSave: false,
            saving: false,
            saved: null
          };
          states.push(state);
          return state;
        };

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

        var watchAndSave = function(object, storage) {
          var state = createState();
          
          // Populate
          storage.get(state).then(function(value) {
            $rootScope.$applyAsync(function() {
              if( value ) {
                angular.copy(value, object);
              }
              state.initialized = true;
              state.saved = angular.copy(value);
            });
          });
          
          // Watch and save
          $rootScope.$watch(function() {
            return angular.equals(object, state.saved);
          }, function(stable) {
            if( !state.initialized || stable ) { return; }
            state.needSave = true;
          });

          $rootScope.$watch(function() {
            return state.needSave && !state.saving;
          }, function(value) {
            if( !value ) { return; }
            state.saving = true;
            state.needSave = false;
            var toBeSaved = angular.copy(object);
            storage.set(toBeSaved, state)
              .catch(function() {
                $log.error("Failed to save, retrying...");
                state.needSave = true;
              })
              .then(function() {
                state.saved = toBeSaved;
              })
              .finally(function() {
                state.saving = false;
              });
          });

        };

        service.persistObject = function(object, name) {
          var storage = {
            get: function(state) {
              return $q.when(kbucket.getData())
                .then(function(res) {
                  return res[name];
                });
            },
            set: function(value, state) {
              var data = {};
              data[name] = value;
              return $q.when(kbucket.setData(data));
            }
          };

          watchAndSave(object, storage);
        };

        service.persistCollection = function(collection, name) {
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

          var kcollection = kbucket.collection(name);

          var storage = {
            get: function(state) {
              return $q.when(kcollection.listRecords())
                .then(function(res) {
                  return res.data;
                });
            },
            set: function(value, state) {
              var changes = detectChanges(value, state.saved);
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
              }));
            }
          };

          // Patch collection
          var originalGet = collection.get;
          collection.get = function(id) {
            return init().then(function() {
              return originalGet.bind(collection)(id);
            });
          };

          watchAndSave(collection.items, storage);
        };

      })();
    };
  });

