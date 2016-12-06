angular.module('editor.views.home', ['ui.router', 'editor.services.auth'])
  .config(function($stateProvider) {
    $stateProvider.state('home', {
      url: '',
      controller: 'HomeController'
    });
  })
  .controller('HomeController', function($state, auth) {
    if(auth.user) {
      $state.go('recipes', {project: auth.user});
    }
    else {
      $state.go('auth.login');
    }
  });

