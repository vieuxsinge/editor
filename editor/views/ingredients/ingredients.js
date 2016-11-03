angular.module('editor.views.ingredients', ['ui.router', 'editor.data.settings',
  'editor.data.ingredients', 'editor.filters.recipe'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('ingredients', {
      url: '/ingredients',
      abstract: true,
      views: {
        '': {
          templateUrl: 'editor/views/layout/layout.header.html',
          controller: function($scope, ingredients, settings) {
            $scope.ingredients = ingredients;
            $scope.settings = settings;
            $scope.copy = angular.copy;
            $scope.remove = function(array, item) {
              var index = array.indexOf(item);
              array.splice(index, 1);
            };
          }
        },
        'header@ingredients': {
          templateUrl: 'editor/views/ingredients/header.html'
        }
      }
    }).state('ingredients.default', {
      url: '',
      controller: ['$state', function($state) {
        $state.go('ingredients.fermentables');
      }]
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
  }])
  .run(['mainMenu', function(mainMenu) {
    mainMenu.add('Ingrédients', 'ingredients.default', 'ingredients');
  }]);

