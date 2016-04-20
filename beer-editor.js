angular.module('beerEditor', [])
  .controller('BeerEditorController', function($scope, $http) {

    // Storage and default values
    $scope.autostore = function(key, default_value) {
      this[key] = localStorage[key] ? JSON.parse(localStorage[key]) : 
                                      angular.copy(default_value);

      this.$watch(key, function(value) {
        localStorage[key] = JSON.stringify(value);
      }, true);
    };

    var DEFAULT_EQUIPMENT = {
      boil_rate: 10
    };
  
    var DEFAULT_RECIPE = {
      batchSize: 50,
      boil_time: 60,
      fermentables: [],
      spices: []
    };

    $scope.clear = function() {
      $scope.recipe = angular.copy(DEFAULT_RECIPE);
      $scope.equipment = angular.copy(DEFAULT_EQUIPMENT);
    };
    
    $scope.autostore('recipe', DEFAULT_RECIPE);
    $scope.autostore('equipment', DEFAULT_EQUIPMENT);

    // Calculations
    var boil_size = function(recipe, equipment) {
      return recipe.batchSize +
             recipe.batchSize*equipment.boil_rate/100
                             *recipe.boil_time/60;
    };

    var update_calculations = function() {
      var recipe = $scope.recipe;
      var equipment = $scope.equipment;

      var calculations = new Brauhaus.Recipe(recipe);
      calculations.boilSize = boil_size(recipe, equipment);
      calculations.calculate();

      $scope.calculations = calculations;
    };

    $scope.$watch('recipe', update_calculations, true);
    $scope.$watch('equipment', update_calculations, true);

    // Ingredients
    $scope.fermentables = [];
    $http.get('fermentables.json').then(function(response) {
      $scope.fermentables = response.data;
    });

  });

