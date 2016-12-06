angular.module('editor.directives.authForm', ['editor.services.auth'])
  .controller('AuthFormController', function($scope, $state, auth, authService) {
    $scope.auth = auth;
    $scope.authService = authService;
  })
  .component('authForm', {
    templateUrl: 'editor/directives/authForm/authForm.html',
    controller: 'AuthFormController'
  });
