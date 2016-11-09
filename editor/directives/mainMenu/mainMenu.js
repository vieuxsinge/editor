angular.module('editor.directives.mainMenu', ['editor.services.menu'])
  .factory('mainMenu', ['Menu', function(Menu) {
    return new Menu();
  }])
  .controller('MainMenuController', function($scope, mainMenu) {
    $scope.menu = mainMenu;
  })
  .component('mainMenu', {
    templateUrl: 'editor/directives/mainMenu/mainMenu.html',
    controller: 'MainMenuController'
  });

