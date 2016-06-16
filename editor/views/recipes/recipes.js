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
    efficiency: 75,
    boilRate: 10,
    coolRate: 5,
    lostVolume: 10,
    batchSize: 50,
    boilTime: 60,
    fermentables: [],
    hops: [],
    others: [],
    yeast: []
  })
  .controller('RecipesController', function($scope, $state, recipes,
    DEFAULT_RECIPE) {
    
    $scope.recipes = recipes;
    
    recipes.list().then(function(items) {
      $scope.recipesList = items;
    });

    $scope.create = function() {
      var newRecipe = angular.copy(DEFAULT_RECIPE);
      recipes.save(newRecipe).then(function() {
        $state.go('recipes.recipe', { id: newRecipe.id });
      });
    };

  });

