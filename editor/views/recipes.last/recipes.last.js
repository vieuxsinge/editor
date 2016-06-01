angular.module('editor.views.recipes.last', ['ui.router',
  'editor.directives.mainMenu', 'editor.views.recipes'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes.last', {
      url: '',
      views: {
        '': {
          templateUrl: 'editor/views/recipes.last/last.html',
          controller: 'RecipesLastController'
        }
      }
    });
  }])
  .run(['mainMenu', function(mainMenu) {
    mainMenu.add('Recettes', 'recipes.last', 'recipes');
  }])
  .controller('RecipesLastController', function($scope, $state, recipes) {
    $scope.$watch(
      function() { return recipes.list.length; },
      function(len) {
        if( len <= 0 ) { return; }
        $state.go('recipes.recipe', { id: recipes.list[0].id });
      }
    );
  });

