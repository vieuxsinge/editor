angular.module('editor.views.recipes', ['ui.router', 'editor.data.recipes',
  'editor.data.settings'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes', {
      url: '/recipes',
      abstract: true,
      templateUrl: 'editor/views/recipes/recipes.html',
      controller: 'RecipesController'
    });
  }])
  .controller('RecipesController', function($scope, $state, recipes, settings) {
    
    $scope.recipes = recipes;

    $scope.create = function() {
      recipes.create(angular.copy(settings.defaults.recipe)).then(function(recipe) {
        $state.go('recipes.recipe', { id: recipe.id });
      });
    };

  });

