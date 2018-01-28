angular.module('editor.views.accounts', ['ui.router', 'ui.bootstrap', 'editor.data.auth', 'editor.services.accounts'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('accounts', {
      url: '/accounts',
      views: {
        '@': {
          templateUrl: 'editor/views/layout/layout.html',
          controller: 'AccountsController'
        },
        '@accounts': {
          templateUrl: 'editor/views/accounts/accounts.html'
        }
      }
    })
    .state('accounts.error', {
      url: '/error',
      templateUrl: 'editor/views/accounts/error.html'
    });
  }])
  .controller('AccountsController', function($scope, $state, $uibModal, auth, accounts) {
    $scope.create = function(username, password) {
      console.log(username, password);
      accounts.create(username, password).then(() => {
          auth.user = username;
          auth.auth = 'Basic ' + btoa(username + ':' + password);
          $state.go('recipes');
      }, function() {
        $scope.error = true;
        $scope.$apply();
      });
    };
  });
