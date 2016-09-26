angular.module('editor.views.recipes.recipe', ['ui.router',
  'editor.data.ingredients', 'editor.data.recipes',
  'editor.views.recipes', 'editor.directives.range'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes.recipe', {
      url: '/:id',
      views: {
        '': {
          templateUrl: 'editor/views/recipes.recipe/layout.html',
          controller: 'RecipesRecipeController'
        },
        'content@recipes.recipe': {
          templateUrl: 'editor/views/recipes.recipe/recipe.html'
        },
        'header@recipes.recipe': {
          templateUrl: 'editor/views/recipes.recipe/header.html'
        },
        'info@recipes.recipe': {
          templateUrl: 'editor/views/recipes.recipe/calculations.html'
        }
      }
    });
  }])
  .controller('RecipesRecipeController', function($scope, $http, $filter,
    $state, $stateParams, recipes, ingredients) {

    var recipeId = $stateParams.id;
    $scope.recipeId = $stateParams.id;

    $scope.recipes = recipes;
    
    recipes.get(recipeId).then(function(response) {
      $scope.recipe = response;
    });

    // Go to last recipe if current recipe disappear
    $scope.$watch('(recipes.items | filter:{id:recipeId}).length',
      function(len) {
        if( len > 0 ) { return; }
        $state.go('recipes.last');
      }
    );

    $scope.copy = angular.copy;
    $scope.bh = Brauhaus;

    $scope.remove = function(array, item) {
      var index = array.indexOf(item);
      array.splice(index, 1);
    };

    // Calculations
    var boilSize = function(recipe) {
      var cooledVolume = recipe.batchSize + recipe.lostVolume;
      var postBoilVolume = cooledVolume / (1 - recipe.coolRate/100);
      return postBoilVolume / (1 - recipe.boilRate/100 * recipe.boilTime/60);
    };

    var updateCalculations = function(recipe) {
      if( !recipe ) { return; }
      var calculations = new Brauhaus.Recipe({
        batchSize: recipe.batchSize + recipe.lostVolume,
        boilSize: boilSize(recipe),
        mashEfficiency: recipe.efficiency,
        fermentables: recipe.fermentables,
        spices: recipe.hops,
        yeast: recipe.yeast
      });

      angular.forEach(calculations.spices, function(item) {
        item.weight /= 1000;
      });
      
      calculations.calculate();
      
      calculations.buToGu = calculations.buToGu || 0;

      $scope.calculations = calculations;
    };

    $scope.$watch('recipe', updateCalculations, true);

    $scope.bitterness = function(hop, calculations) {
      var bhSpice = new Brauhaus.Spice(hop);
      bhSpice.weight /= 1000;
      return bhSpice.bitterness('tinseth', $scope.earlyOg(calculations), calculations.batchSize);
    };

    $scope.earlyOg = function(calculations) {
      var earlyOg = 1.0;
      angular.forEach(calculations.fermentables, function(fermentable) {
        addition = fermentable.addition();
        if( addition == 'steep' ) {
          efficiency = calculations.steepEfficiency / 100.0;
        }
        else if( addition == 'mash' ) {
          efficiency = calculations.mashEfficiency / 100.0;
        }
        else {
          efficiency = 1.0;
        }

        if( !fermentable.late ) {
          earlyOg += fermentable.gu(calculations.boilSize) * efficiency / 1000.0;
        }
      });
      return earlyOg;
    };

    $scope.recipeWeightYielded = function(recipe) {
      if( !recipe ) { return 0; }

      var weightYielded = 0;
      angular.forEach(recipe.fermentables, function(item) {
        weightYielded += item.weight * item.yield / 100;
      });
      return weightYielded;
    };

    // Ingredients
    $scope.ingredients = ingredients;

    $scope.numberOfIngredients = function(recipe) {
      if( !recipe ) { return 0; }
      return recipe.fermentables.length + recipe.hops.length
             + recipe.yeast.length + recipe.others.length;
    };

    $scope.addFermentable = function(recipe, fermentable) {
      var item = angular.copy(fermentable);
      item.weight = 0;
      recipe.fermentables.push(item);
    };

    $scope.hopFormats = {pellet:'Pellet', cone:'Cône', other:'Autre'};
    $scope.moments = {'first-wort':"Empâtage", boil:"Ébullition",
                         late:"Fin d'ébullition", dry:"À froid"};

    $scope.addHop = function(recipe, hop) {
      var item = angular.copy(hop);
      item.weight = 0;
      item.time = 0;
      item.format = 'pellet';
      item.moment = 'boil';
      recipe.hops.push(item);
    };

    $scope.addOther = function(recipe, ingredient) {
      var item = angular.copy(ingredient);
      item.weight = 0;
      item.time = 0;
      item.moment = 'boil';
      recipe.others.push(item);
    };

  });

