angular.module('editor.services.persistence', ['editor.data.recipes'])
  .provider('persistence', function() {
    var provider = this;

    provider.$get = function($rootScope, $q, $log) {
      var factory = this;

      return new (function() {
        var service = this;

        service.settings = {
          url: '',
          headers: {},
          bucket: 'default'
        };

        $rootScope.$watch(function() {
          return [service.settings, setupFunctions];
        }, function() {
          if(setupFunctions.length == 0) { return; }
          setup();
        }, true);

        var kbucket;

        var states;
        var createState = function() {
          var state = {
            initialized: false,
            needSave: false,
            saving: false,
            saved: null,
            cleanupFunctions: []
          };
          states.push(state);
          return state;
        };

        var initDeferred;
        var waitInit = function() {
          return initDeferred.promise;
        };

        var setupFunctions = [];
        var setup = function() {
          if(states) {
            angular.forEach(states, function(state) {
              angular.forEach(state.cleanupFunctions, function(func) {
                func();
              });
            });
          }
          states = [];

          if(initDeferred) {
            initDeferred.reject();
          }
          initDeferred = $q.defer();

          var kinto = new KintoClient(service.settings.url, {
            headers: service.settings.headers
          });
          kbucket = kinto.bucket(service.settings.bucket);

          initDeferred.promise.finally(
            $rootScope.$watch(function() {
              return states.reduce(function(value, state) {
                return value && state.initialized;
              }, true);
            }, function(initialized) {
              if( !initialized ) { return; }
              initDeferred.resolve();
            })
          );

          angular.forEach(setupFunctions, function(func) {
            func();
          });
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
          }).catch(function() {
            $log.error("Failed to retrieve", object);
          });

          // Watch and save
          state.cleanupFunctions.push(
            $rootScope.$watch(function() {
              return object;
            }, function(newObject, oldObject) {
              if( !state.initialized || angular.equals(newObject, oldObject) ) { return; }
              state.needSave = true;
            }, true)
          );

          state.cleanupFunctions.push(
            $rootScope.$watch(function() {
              return state.needSave && !state.saving;
            }, function(value) {
              if( !value ) { return; }
              state.saving = true;
              state.needSave = false;
              var toBeSaved = angular.copy(object);
              storage.set(toBeSaved, state)
                .catch(function(err) {
                  $log.error("Failed to save, retrying...", err);
                  state.needSave = true;
                })
                .then(function() {
                  state.saved = toBeSaved;
                })
                .finally(function() {
                  state.saving = false;
                });
            })
          );

        };

        var persistObjectSetup = function(object, name) {
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

        var persistCollectionSetup = function(collection, name) {
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
                  var options = {};
                  if (item.hasOwnProperty('isPublic')) {
                    var permissions = {}
                    if (item.isPublic == true) {
                        permissions['read'] = ['system.Everyone',];
                    }
                    options['permissions'] = permissions;
                  }
                  console.log('updateRecord', item, options);
                  batch.updateRecord(item, options);
                });
              }));
            }
          };

          // Patch collection
          var originalGet = collection.get;
          collection.get = function(id) {
            return waitInit().then(function() {
              return originalGet.bind(collection)(id);
            });
          };

          watchAndSave(collection.items, storage);
        };

        service.persistObject = function(object, name) {
          setupFunctions.push(persistObjectSetup.bind(null, object, name));
        };

        service.persistCollection = function(collection, name) {
          setupFunctions.push(persistCollectionSetup.bind(null, collection, name));
        };

      })();
    };
  });
