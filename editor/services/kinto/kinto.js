angular.module('editor.services.kinto', [])
  .factory('kinto', function($rootScope) {
    return new (function() {
      var service = this;

      service.settings = {
        url: null,
        options: {}
      };

      $rootScope.$watch(function() {
        return service.settings;
      }, function() {
        service.kinto = new KintoClient(service.settings.url,
          service.settings.options);
      }, true);

      service.get = function() {
        return service.kinto;
      };

    })();
  });
