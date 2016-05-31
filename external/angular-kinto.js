angular.module('angular-kinto', [])
  .factory('$kinto', function($rootScope, $log) {
    
    var kinto = new Kinto();
    var collection = function(name) {
      return new (function() {
        
        var self = this;
        var kcollection = kinto.collection(name);
        
        var refresh = function() {
          kcollection.list()
            .then(function(res) {
              self.records = res.data;
              $rootScope.$apply();
              return res;
            })
            .catch(function(err) {
              $log.error(err);
            });
        };

        var forceRefresh = function(object, func) {
          return function() {
            var promise = func.apply(object, arguments);
            promise.then(function(res) {
              refresh();
              return res;
            })
            .catch(function(err) {
              $log.error(err);
            });
            return promise;
          };
        };

        this.records = [];
        this.get = forceRefresh(kcollection, kcollection.get);
        this.create = forceRefresh(kcollection, kcollection.create);
        this.update = forceRefresh(kcollection, kcollection.update);
        this.delete = forceRefresh(kcollection, kcollection.delete);
        this.clear = forceRefresh(kcollection, kcollection.clear);

        refresh();

      })();
    };
  
    return {
      collection: collection
    };
  });

