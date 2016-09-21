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

    $scope.create = function() {
      recipes.save(angular.copy(DEFAULT_RECIPE)).then(function(recipe) {
        $state.go('recipes.recipe', { id: recipe.id });
      });
    };

  });

