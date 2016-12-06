angular.module('editor.conf.auth', ['ngStorage', 'editor.services.auth'])
  .decorator('auth', function($delegate, $localStorage) {
    $localStorage.$default({auth: $delegate});
    return $localStorage.auth;
  });
