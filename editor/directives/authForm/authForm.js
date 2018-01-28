angular.module('editor.directives.authForm', ['editor.data.auth', 'editor.services.accounts'])
  .controller('AuthFormController', function($scope, $state, auth, accounts) {
    $scope.auth = auth;

    $scope.login = function(user, password) {
      accounts.login(user, password).then(function() {
        auth.user = user;
        auth.auth = 'Basic ' + btoa(user + ':' + password);
        $state.go('recipes');
      }, function() {
        $state.go('accounts.error');
      }).then(function() {
        $scope.$apply();
      });
    };

    $scope.logout = function() {
      auth.user = null;
      auth.auth = null;
    };
  })
  .component('authForm', {
    templateUrl: 'editor/directives/authForm/authForm.html',
    controller: 'AuthFormController'
  });
