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
    
    $scope.remove = function(array, index) {
      array.splice(index, 1);
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
      var calculations = new Brauhaus.Recipe($scope.recipe);
      calculations.boilSize = boilSize($scope.recipe, $scope.equipment);
      calculations.mashEfficiency = $scope.equipment.mashEfficiency;

      angular.forEach(calculations.spices, function(item) {
        item.weight /= 1000;
        console.log(item);
      });
      
      calculations.calculate();
      
      calculations.buToGu = calculations.buToGu || 0;

      $scope.calculations = calculations;
    };

    $scope.$watch('recipe', updateCalculations, true);
    $scope.$watch('equipment', updateCalculations, true);

    $scope.spiceBitterness = function(spice, calculations) {
      var bhSpice = new Brauhaus.Spice(spice);
      bhSpice.weight /= 1000;
      return bhSpice.bitterness('tinseth', calculations.og, calculations.batchSize);
    };

    $scope.recipeWeight = function(recipe) {
      var weight = 0;
      angular.forEach(recipe.fermentables, function(item) {
        weight += item.weight;
      });
      return weight;
    };

    $scope.numberOfIngredients = function(recipe) {
      return recipe.fermentables.length + recipe.spices.length
             + recipe.yeast.length;
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

    $scope.addFermentable = function(recipe, fermentable) {
      var item = angular.copy(fermentable);
      item.weight = 0;
      recipe.fermentables.push(item);
    };

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

    $scope.spiceFormats = {pellet:'Pellet', cone:'Cône', other:'Autre'};
    $scope.spiceMoments = {'first-wort':"Empâtage", boil:"Ébullition",
                           late:"Fin d'ébullition", dry:"À froid"};

    $scope.addSpice = function(recipe, spice) {
      var item = angular.copy(spice);
      item.weight = 0;
      item.time = 0;
      item.format = 'pellet';
      item.moment = 'boil';
      recipe.spices.push(item);
    };

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

