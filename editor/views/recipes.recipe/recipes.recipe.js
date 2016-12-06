angular.module('editor.views.recipes.recipe', ['ui.router', 'monospaced.elastic',
  'editor.data.styles', 'editor.data.settings', 'editor.services.calculator',
  'editor.views.recipes', 'editor.views.project', 'editor.directives.range',
  'editor.filters.recipe', 'editor.filters.text'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes.recipe', {
      url: '/{recipe}',
      views: {
        '@': {
          templateUrl: 'editor/views/layout/layout.header.html',
          controller: 'RecipesRecipeController'
        },
        'header@recipes.recipe': {
          templateUrl: 'editor/views/recipes.recipe/header.html'
        },
        '@recipes.recipe': {
          templateUrl: 'editor/views/recipes.recipe/body.html'
        }
      }
    });
  }])
  .controller('RecipesRecipeController', function($scope, $state, $stateParams,
    $filter, styles, ingredientsI18n, ingredientsParameters, calculator,
    settings, project) {

    $scope.styles = styles;
    $scope.equipments = project.equipments;
    $scope.settings = settings;
    $scope.calc = calculator;

    var recipeId = $stateParams.id;
    $scope.recipeId = $stateParams.id;

    project.recipes.get(recipeId).then(function(recipe) {
      $scope.recipe = recipe;
      $scope.headerEdit = !recipe.name;
    });

    // Update equipment
    $scope.$watch('recipe.equipment', function(id) {
      $scope.equipment = project.equipments.items.find(function(item) {
        return item.id == id;
      });
    });

    // Watch for volume scaling
    $scope.$watch('recipe.finalVolume', function(newVolume, oldVolume) {
      if( !newVolume || !oldVolume ) { return; }
      if( settings.global.recipeAutoscale ) {
        calculator.recipeScaleVolume($scope.recipe, $scope.equipment, oldVolume, newVolume);
      }
    });

    // Watch for equipment scaling
    $scope.$watch('equipment', function(newEquipment, oldEquipment) {
      if( !newEquipment || !oldEquipment ) { return; }
      if( settings.global.recipeAutoscale ) {
        calculator.recipeScaleEquipment($scope.recipe, oldEquipment, newEquipment);
      }
    });

    $scope.copy = angular.copy;
    $scope.remove = function(array, item) {
      var index = array.indexOf(item);
      array.splice(index, 1);
    };

    // Ingredients
    $scope.ingredients = project.ingredients;
    $scope.ingredientsI18n = ingredientsI18n;
    $scope.ingredientsParameters = ingredientsParameters;

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

