angular.module('editor.services.kinto', [])
  .factory('$kinto', function($rootScope) {
    return new (function() {
      var $kinto = this;

      $kinto.kinto = new Kinto();

      $kinto.collection = function(name) {
        var collection = this;
        var kcollection = $kinto.kinto.collection(name);

        collection.needSync = true;
        var sync = function() {
          collection.needSync = false;
          return kcollection.sync({
            remote: "https://kinto.notmyidea.org/v1",
            headers: {Authorization: "Basic " + btoa("editor:pass")},
            strategy: Kinto.syncStrategy.SERVER_WINS
          }).catch(function(err) {
            if (err.message.includes("flushed")) {
              console.warning("New server or flushed server: syncing local data");
              return kcollection.resetSyncStatus()
                .then(function() { sync(); });
            }
            throw err;
          });
        };

        $rootScope.$watch(function() { return collection.needSync; }, function(needSync) {
          if( !needSync ) { return; }
          sync();
        });

        var askForSync = function() {
          collection.needSync = true;
        };

        var applyScope = function(resp) {
          $rootScope.$applyAsync();
          return resp;
        };

        collection.list = function() {
          return kcollection.list()
            .then(applyScope);
        };

        collection.items = [];
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
            .then(askForSync)
            .then(applyScope);
        };
        
        collection.remove = function(id) {
          return kcollection.delete(id)
            .then(refreshItems)
            .then(askForSync)
            .then(applyScope);
        };

        sync().then(refreshItems)
              .then(applyScope);

      };

    })();
  });

