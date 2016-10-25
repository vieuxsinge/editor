angular.module('editor.views.recipes.recipe', ['ui.router',
  'editor.data.ingredients', 'editor.data.recipes', 'editor.data.styles',
  'editor.data.equipments', 'editor.data.settings', 'editor.services.calculator',
  'editor.views.recipes', 'editor.directives.range', 'editor.filters.recipe'])
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
          templateUrl: 'editor/views/recipes.recipe/profile.html'
        }
      }
    });
  }])
  .controller('RecipesRecipeController', function($scope, $state, $stateParams,
    $filter, styles, equipments, recipes, ingredients, calculator, settings) {

    $scope.styles = styles;
    $scope.equipments = equipments;
    $scope.calc = calculator;

    var recipeId = $stateParams.id;
    $scope.recipeId = $stateParams.id;

    recipes.get(recipeId).then(function(recipe) {
      $scope.recipe = recipe;
      $scope.headerEdit = !recipe.name;
      
      // Go to last recipe if current recipe disappear
      $scope.recipes = recipes;
      $scope.$watch('(recipes.items | filter:{id:recipe.id}).length',
        function(len) {
          if( len > 0 ) { return; }
          $state.go('recipes.last');
        }
      );

    });

    $scope.$watch('recipe', function(recipe) {
      if( !recipe ) { return; }
      var found = $filter('filter')(equipments.items, {id:$scope.recipe.equipment});
      $scope.equipment = found ? found[0] : settings.defaults.equipment;
    });

    $scope.copy = angular.copy;
    $scope.remove = function(array, item) {
      var index = array.indexOf(item);
      array.splice(index, 1);
    };

    // Ingredients
    $scope.ingredients = ingredients;

    $scope.numberOfIngredients = function(recipe) {
      if( !recipe ) { return 0; }
      return recipe.fermentables.length + recipe.hops.length
             + recipe.yeast.length + recipe.others.length;
    };

    $scope.fermentableMoments = {
      steep:  "Trempage",
      mash:   "Empâtage",
      boil:   "Ébullition"
    };

    $scope.addFermentable = function(recipe, fermentable) {
      var item = angular.copy(fermentable);
      item.weight = 0;
      recipe.fermentables.push(item);
    };

    $scope.hopFormats = {
      pellet: "Pellet",
      cone:   "Cône"
    };

    $scope.hopMoments = {
      mash:           "Empâtage",
      'first-wort':   "Premier jus",
      boil:           "Ébullition",
      late:           "Fin d'ébullition",
      dry:            "À froid"
    };

    $scope.addHop = function(recipe, hop) {
      var item = angular.copy(hop);
      item.weight = 0;
      item.time = 0;
      item.format = 'pellet';
      item.moment = 'boil';
      recipe.hops.push(item);
    };

    $scope.otherMoments = $scope.hopMoments;

    $scope.addOther = function(recipe, ingredient) {
      var item = angular.copy(ingredient);
      item.weight = 0;
      item.time = 0;
      item.moment = 'boil';
      recipe.others.push(item);
    };

  });

