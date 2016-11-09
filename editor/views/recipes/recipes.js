angular.module('editor.views.recipes', ['ui.router', 'ui.bootstrap',
  'editor.data.recipes', 'editor.data.settings', 'editor.views.layout'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes', {
      url: '/recipes',
      views: {
        '@': {
          templateUrl: 'editor/views/layout/layout.html',
          controller: 'RecipesController'
        },
        '@recipes': {
          templateUrl: 'editor/views/recipes/recipes.html'
        }
      }
    });
  }])
  .run(['mainMenu', function(mainMenu) {
    mainMenu.add('Recettes', 'recipes', 'recipes');
  }])
  .controller('RecipesController', function($scope, $state, $uibModal, recipes,
    equipments, settings) {
    
    $scope.recipes = recipes;
    $scope.equipments = equipments;

    $scope.create = function() {
      recipes.create(angular.copy(settings.defaults.recipe)).then(function(recipe) {
        $state.go('recipes.recipe', { id: recipe.id });
      });
    };

    $scope.remove = function(id) {
      $uibModal.open({
        templateUrl: 'editor/views/recipes/modal_remove.html'
      }).result.then(function() {
        recipes.remove(id);
      });
    };

  });

