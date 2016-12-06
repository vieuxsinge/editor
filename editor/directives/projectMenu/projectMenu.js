angular.module('editor.directives.projectMenu', ['editor.services.menu'])
  .factory('projectMenu', ['Menu', function(Menu) {
    return new Menu();
  }])
  .controller('ProjectMenuController', function($scope, projectMenu) {
    $scope.menu = projectMenu;
  })
  .component('projectMenu', {
    templateUrl: 'editor/directives/projectMenu/projectMenu.html',
    controller: 'ProjectMenuController'
  });

