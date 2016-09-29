angular.module('editor.views.recipes.print', ['ui.router',
  'editor.views.recipes.recipe'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes.print', {
      parent: 'recipes.recipe',
      url: '/print',
      views: {
        '@': {
          templateUrl: 'editor/views/recipes.print/print.html',
          controller: 'RecipesRecipeController'
        }
      }
    });
  }]);

