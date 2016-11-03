angular.module('editor.views.equipments', ['ui.router', 'ui.bootstrap',
  'editor.data.equipments', 'editor.data.settings'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('equipments', {
      url: '/equipments',
      views: {
        '@': {
          templateUrl: 'editor/views/layout/layout.html',
          controller: 'EquipmentsController'
        },
        '@equipments': {
          templateUrl: 'editor/views/equipments/equipments.html'
        }
      }
    });
  }])
  .run(['mainMenu', function(mainMenu) {
    mainMenu.add('Équipements', 'equipments', 'equipments');
  }])
  .controller('EquipmentsController', function($scope, $state, $uibModal,
    equipments, settings) {
    
    $scope.equipments = equipments;

    $scope.create = function() {
      equipments.create(angular.copy(settings.defaults.equipment)).then(function(equipment) {
        $state.go('equipments.equipment', { id: equipment.id });
      });
    };

    $scope.remove = function(id) {
      $uibModal.open({
        templateUrl: 'editor/views/equipments/modal_remove.html'
      }).result.then(function() {
        equipments.remove(id);
      });
    };

  });

