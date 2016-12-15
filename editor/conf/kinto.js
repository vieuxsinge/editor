angular.module('editor.conf.kinto', ['editor.services.kinto',
  'editor.services.auth'])
  .run(function($rootScope, kinto, auth) {

    kinto.settings.url = 'https://kinto.notmyidea.org/v1/';

    $rootScope.$watch(function() { return auth.user; }, function() {
      headers = {}
      if( auth.user ) {
        headers['Authorization'] = 'Basic ' + btoa(auth.user + ':' + auth.pass);
      }
      kinto.settings.options.headers = headers;
    });

  });
