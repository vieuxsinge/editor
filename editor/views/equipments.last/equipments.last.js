angular.module('editor.views.equipments.last', ['ui.router',
  'editor.directives.mainMenu', 'editor.data.equipments',
  'editor.views.equipments'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('equipments.last', {
      url: '',
      views: {
        '': {
          templateUrl: 'editor/views/equipments.last/last.html',
          controller: 'EquipmentsLastController'
        }
      }
    });
  }])
  .run(['mainMenu', function(mainMenu) {
    mainMenu.add('Équipements', 'equipments.last', 'equipments');
  }])
  .controller('EquipmentsLastController', function($scope, $state, equipments) {
    $scope.equipments = equipments;

    $scope.$watch('equipments.items.length', function(len) {
      if( !len || len <= 0 ) { return; }
      $state.go('equipments.equipment', {id: equipments.items[0].id});
    });
  });

