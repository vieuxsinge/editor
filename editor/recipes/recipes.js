angular.module('editor.recipes', ['ui.router', 'editor.storage'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes', {
      url: '/recipes',
      abstract: true,
      templateUrl: 'editor/recipes/recipes.html',
      controller: 'RecipesController'
    });
  }])
  .factory('recipes', ['storage', function(storage) {
    return storage.collection('recipes');
  }])
  .value('DEFAULT_RECIPE', {
    batchSize: 20,
    boilTime: 60,
    fermentables: [],
    spices: [],
    yeast: []
  })
  .controller('RecipesController', ['$scope', 'recipes', 'DEFAULT_RECIPE',
    function($scope, recipes, DEFAULT_RECIPE) {
    
    var updateList = function() {
      recipes.list()
        .then(function(res) {
          $scope.recipes = res.data;
          $scope.$apply();
        })
        .catch(function(err) {
          console.error(err);
        });
    };

    $scope.clear = function() {
      recipes.clear()
        .then(updateList)
        .catch(function(err) {
          console.error(err);
        });
    };

    $scope.create = function() {
      recipes.create(DEFAULT_RECIPE)
        .then(updateList)
        .catch(function(err) {
          console.error(err);
        });
    };


    $scope.$watch('recipes', function(data) {
      console.log("Updated recipes list!", data);
    });

    updateList();

  }]);

