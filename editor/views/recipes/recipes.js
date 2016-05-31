angular.module('editor.views.recipes', ['ui.router', 'editor.services.recipes'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes', {
      url: '/recipes',
      abstract: true,
      templateUrl: 'editor/views/recipes/recipes.html',
      controller: 'RecipesController'
    });
  }])
  .value('DEFAULT_RECIPE', {
    batchSize: 20,
    boilTime: 60,
    fermentables: [],
    spices: [],
    yeast: []
  })
  .controller('RecipesController', function($scope, recipes, DEFAULT_RECIPE) {
    
    $scope.recipes = recipes;

    $scope.create = function() {
      recipes.create(DEFAULT_RECIPE);
    };

  });

