angular.module('editor.views.settings', ['ui.router', 'editor.views.layout',
  'editor.data.settings'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('settings', {
      parent: 'layout',
      url: '/settings',
      templateUrl: 'editor/views/settings/settings.html',
      controller: ['$scope', 'settings', function($scope, settings) {
        $scope.settings = settings;
      }]
    });
  }])
  .run(['mainMenu', function(mainMenu) {
    mainMenu.add('Configuration', 'settings', 'settings');
  }]);

