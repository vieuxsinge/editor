angular.module('editor.services.kinto', [])
  .factory('kinto', function() {
    return new KintoClient("https://kinto.notmyidea.org/v1", {
      headers: {Authorization: "Basic " + btoa("editor:pass")}
    });
  });

