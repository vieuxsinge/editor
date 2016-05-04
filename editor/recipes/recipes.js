angular.module('editor.recipes', ['ui.router'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes', {
      url: '/recipes',
      abstract: true,
      templateUrl: 'editor/recipes/recipes.html',
      controller: 'RecipesController'
    });
  }])
  .controller('RecipesController', [function() {}]);

