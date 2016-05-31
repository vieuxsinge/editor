angular.module('editor.directives.mainMenu', ['editor.services.menu'])
  .factory('mainMenu', ['Menu', function(Menu) {
    return new Menu();
  }])
  .controller('MainMenuController', ['mainMenu', function(mainMenu) {
    this.items = mainMenu.items;
  }])
  .component('mainMenu', {
    templateUrl: 'editor/directives/mainMenu/mainMenu.html',
    controller: 'MainMenuController'
  });

