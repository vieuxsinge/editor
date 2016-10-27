angular.module('editor.views.recipes.sheet', ['ui.router',
  'editor.views.recipes.recipe'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes.sheet', {
      parent: 'recipes.recipe',
      url: '/sheet',
      views: {
        '@': {
          templateUrl: 'editor/views/recipes.sheet/sheet.html',
          controller: 'RecipesRecipeController'
        }
      }
    });
  }]);

