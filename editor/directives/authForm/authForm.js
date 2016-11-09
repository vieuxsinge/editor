angular.module('editor.directives.authForm', ['editor.data.auth'])
  .controller('AuthFormController', function($scope, auth) {
    $scope.auth = auth;

    $scope.login = function(user, password) {
      auth.user = user;
      auth.auth = 'Basic ' + btoa(user + ':' + password);
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
