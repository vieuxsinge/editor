angular.module('editor.mainMenu', ['editor.menu'])
  .factory('mainMenu', ['Menu', function(Menu) {
    return new Menu();
  }])
  .controller('MainMenuController', ['mainMenu', function(mainMenu) {
    this.items = mainMenu.items;
  }])
  .component('mainMenu', {
    templateUrl: 'editor/mainMenu/mainMenu.html',
    controller: 'MainMenuController'
  });

