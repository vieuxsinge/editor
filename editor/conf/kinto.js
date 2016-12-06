angular.module('editor.conf.kinto', ['editor.services.kinto',
  'editor.services.auth'])
  .run(function($rootScope, kinto, auth) {

    kinto.settings.url = 'https://kinto.notmyidea.org/v1/';

    $rootScope.$watch(function() { return auth.user + ':' + auth.pass; },
      function(value) {
        headers = value ? {Authorization: 'Basic ' + btoa(value)} : {};
        kinto.settings.options.headers = headers;
      });

  });