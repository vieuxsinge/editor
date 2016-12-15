angular.module('editor.views.ingredients', ['ui.router',
  'editor.directives.projectMenu', 'editor.data.settings',
  'editor.data.ingredients', 'editor.filters.recipe'])
  .config(function($stateProvider) {
    $stateProvider.state('ingredients', {
      parent: 'project',
      url: '/ingredients',
      abstract: true,
      views: {
        '': {
          templateUrl: 'editor/views/ingredients/menu.html',
          controller: function($scope, ingredientsParameters, ingredientsI18n,
            settings, project) {
            $scope.ingredientsParameters = ingredientsParameters;
            $scope.ingredientsI18n = ingredientsI18n;
            $scope.settings = settings;
            $scope.copy = angular.copy;

            var refresh = function() {
              return project.ingredients.list().then(function(ingredients) {
                $scope.ingredients = ingredients;
              }).catch(function(e) {
                //TODO
              });
            };

            $scope.create = function(ingredient) {
              project.ingredients.create(ingredient).catch(function(e) {
                //TODO
              }).then(function() {
                refresh();
              });
            };
            
            $scope.remove = function(ingredient) {
              project.ingredients.delete(ingredient.id).catch(function(e) {
                //TODO
              }).then(function() {
                refresh();
              });
            };
            
            refresh();
          }
        }
      }
    }).state('ingredients.default', {
      url: '',
      controller: function($state) {
        $state.go('ingredients.fermentables');
      }
    }).state('ingredients.fermentables', {
      url: '/fermentables',
      templateUrl: 'editor/views/ingredients/fermentables.html'
    }).state('ingredients.hops', {
      url: '/hops',
      templateUrl: 'editor/views/ingredients/hops.html'
    }).state('ingredients.yeast', {
      url: '/yeast',
      templateUrl: 'editor/views/ingredients/yeast.html'
    }).state('ingredients.others', {
      url: '/others',
      templateUrl: 'editor/views/ingredients/others.html'
    });
  })
  .run(function(projectMenu) {
    projectMenu.add('Ingrédients', 'ingredients.default', 'ingredients');
  });

