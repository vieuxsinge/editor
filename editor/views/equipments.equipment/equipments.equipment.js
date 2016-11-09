angular.module('editor.views.equipments.equipment', ['ui.router',
  'editor.data.equipments', 'editor.views.equipments'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('equipments.equipment', {
      url: '/:id',
      views: {
        '@': {
          templateUrl: 'editor/views/layout/layout.header.html',
          controller: 'EquipmentsEquipmentController'
        },
        'header@equipments.equipment': {
          templateUrl: 'editor/views/equipments.equipment/header.html'
        },
        '@equipments.equipment': {
          templateUrl: 'editor/views/equipments.equipment/body.html'
        }
      }
    });
  }])
  .controller('EquipmentsEquipmentController', function($scope, $state,
    $stateParams, equipments) {

    var equipmentId = $stateParams.id;
    $scope.equipmentId = $stateParams.id;

    equipments.get(equipmentId).then(function(equipment) {
      $scope.equipment = equipment;
    });

  });

