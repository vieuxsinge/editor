angular.module('editor.views.recipes', ['ui.router', 'ui.bootstrap',
  'editor.views.layout', 'editor.data.recipes', 'editor.data.settings'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes', {
      parent: 'layout',
      url: '/recipes',
      abstract: true,
      templateUrl: 'editor/views/recipes/recipes.html',
      controller: 'RecipesController'
    });
  }])
  .controller('RecipesController', function($scope, $state, $uibModal, recipes,
    settings) {
    
    $scope.recipes = recipes;

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

