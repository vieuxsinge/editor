angular.module('beerEditor', [])
  .controller('BeerEditorController', function($scope, $http, $filter) {

    $scope.copy = angular.copy;
    $scope.bh = Brauhaus;
    $scope.orderBy = $filter('orderBy');

    // Storage and default values
    $scope.autostore = function(key, defaultValue) {
      this[key] = localStorage[key] ? JSON.parse(localStorage[key])
                                    : angular.copy(defaultValue);

      this.$watch(key, function(value) {
        localStorage[key] = JSON.stringify(value);
      }, true);
    };

    var DEFAULT_EQUIPMENT = {
      mashEfficiency: 75,
      boilRate: 10
    };

    var DEFAULT_RECIPE = {
      batchSize: 20,
      boilTime: 60,
      fermentables: [],
      spices: [],
      yeast: []
    };

    $scope.clear = function() {
      $scope.recipe = angular.copy(DEFAULT_RECIPE);
      $scope.equipment = angular.copy(DEFAULT_EQUIPMENT);
    };
    
    $scope.remove = function(array, item) {
      array.splice(item, 1);
    };
    
    $scope.autostore('recipe', DEFAULT_RECIPE);
    $scope.autostore('equipment', DEFAULT_EQUIPMENT);

    // Calculations
    var boilSize = function(recipe, equipment) {
      return recipe.batchSize +
             recipe.batchSize * equipment.boilRate/100
                              * recipe.boilTime/60;
    };

    var updateCalculations = function() {
      $scope.calculations = new Brauhaus.Recipe($scope.recipe);
      $scope.calculations.boilSize = boilSize($scope.recipe, $scope.equipment);
      $scope.calculations.mashEfficiency = $scope.equipment.mashEfficiency;
      $scope.calculations.calculate();
      
      $scope.calculations.buToGu = $scope.calculations.buToGu || 0;
    };

    $scope.$watch('recipe', updateCalculations, true);
    $scope.$watch('equipment', updateCalculations, true);

    $scope.spiceBitterness = function(spice, calculations) {
      return (new Brauhaus.Spice(spice)
        .bitterness('tinseth', calculations.og, calculations.batchSize));
    };

    // Ingredients
    $scope.fermentablesTypes = [
      {filter: {type:'base'}, name: "Malts de base"},
      {filter: {type:'cara'}, name: "Malts caramel"},
      {filter: {type:'roasted'}, name: "Malts grillés"},
      {filter: {type:'dme'}, name: "Extraits de malt"},
      {filter: {type:'flakes'}, name: "Flocons"},
      {filter: {type:'sugar'}, name: "Sucres"}
    ];
    $scope.fermentables = [];
    $http.get('fermentables.json').then(function(response) {
      $scope.fermentables = response.data;
    });

    $scope.spicesTypes = [
      {filter: {type:'hop', origin:'us'}, name: "Houblons Américains"},
      {filter: {type:'hop', origin:'uk'}, name: "Houblons Anglais"},
      {filter: {type:'hop', origin:'de'}, name: "Houblons Allemands"},
      {filter: {type:'hop', origin:'other'}, name: "Houblons d'ailleurs"},
      {filter: {type:'!hop', origin:'other'}, name: "Autres"}
    ];
    $scope.spices = [];
    $http.get('spices.json').then(function(response) {
      $scope.spices = response.data;
    });

    $scope.yeastTypes = [
      {filter: {type:'ale', name:'Wyeast'}, name: "Wyeast Ale"},
      {filter: {type:'lager', name:'Wyeast'}, name: "Wyeast Lager"},
      {filter: {type:'ale', name:'WLP'}, name: "WhiteLabs Ale"},
      {filter: {type:'lager', name:'WLP'}, name: "WhiteLabs Lager"},
      {filter: {type:'!other', format:'dry'}, name: "Levures sèches"},
      {filter: {type:'other'}, name: "Autres bestioles"}
    ];
    $scope.yeast = [];
    $http.get('yeast.json').then(function(response) {
      $scope.yeast = response.data;
    });

  });

