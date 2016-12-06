angular.module('editor.views.auth', ['ui.router', 'editor.views.layout'])
  .config(function($stateProvider) {
    $stateProvider
      .state('auth', {
        abstract: true,
        url: '/auth',
        views: {
          '@': {
            templateUrl: 'editor/views/layout/layout.html'
          }
        }
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: '/editor/views/auth/login.html'
      });
  });

