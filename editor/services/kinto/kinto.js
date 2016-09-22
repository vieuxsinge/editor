angular.module('editor.services.kinto', [])
  .factory('$kinto', function($rootScope, $timeout) {
    return new (function() {
      var $kinto = this;

      $kinto.kinto = new Kinto();

      $kinto.collection = function(name) {
        var collection = this;
        var kcollection = $kinto.kinto.collection(name);

        var applyScope = function(res) {
          $rootScope.$applyAsync();
          return res;
        };

        collection.list = function() {
          return kcollection.list()
            .then(applyScope);
        };

        var refreshItems = function(result) {
          return collection.list().then(function(response) {
            collection.items = response.data;
            return result;
          });
        };

        collection.get = function(id) {
          return kcollection.get(id)
            .then(applyScope);
        };

        collection.save = function(item) {
          if( !item ) {
            return $q.reject();
          }

          var promise;
          if( item.id ) {
            promise = kcollection.update(item);
          }
          else {
            promise = kcollection.create(item);
          }
          
          return promise
            .then(refreshItems)
            .then(applyScope);
        };
        
        collection.remove = function(id) {
          return kcollection.delete(id)
            .then(refreshItems)
            .then(applyScope);
        };

        collection.synchronizing = false;
        collection.sync = function() {
          collection.synchronizing = true;
          return kcollection.sync({
            remote: "https://kinto.notmyidea.org/v1",
            headers: {Authorization: "Basic " + btoa("editor:pass")},
            strategy: Kinto.syncStrategy.SERVER_WINS
          }).catch(function(err) {
            if (err.message.includes("flushed")) {
              console.warning("New server or flushed server: syncing local data");
              return kcollection.resetSyncStatus()
                .then(function() { return collection.sync(); });
            }
            throw err;
          })
          .then(refreshItems)
          .then(function(res) {
            console.log("Synchronized", res);
            return res;
          })
          .then(function() {
            collection.synchronizing = false;
          },function() {
            collection.synchronizing = false;
          });
        };

        collection.sync();

      };

    })();
  });

