angular.module('editor.services.auth', [])
  .value('auth', {
    user: null,
    pass: null
  })
  .service('authService', function($state, auth) {
    this.login = function(user, pass, redirect='home') {
      auth.user = user;
      auth.pass = pass;
      $state.go(redirect);
    };

    this.logout = function(redirect='home') {
      auth.user = null;
      auth.pass = null;
      $state.go(redirect);
    };
  });

